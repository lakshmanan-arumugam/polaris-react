import React from 'react';
import { classNames } from '../../utilities/css.js';
import { secondsToTimeComponents, secondsToDurationTranslationKey, secondsToTimestamp } from '../../utilities/duration.js';
import styles from './VideoThumbnail.scss.js';
import PlayIcon from './illustrations/play.svg.js';
import { useI18n } from '../../utilities/i18n/hooks.js';

function VideoThumbnail({
  thumbnailUrl,
  videoLength = 0,
  videoProgress = 0,
  showVideoProgress = false,
  accessibilityLabel,
  onClick,
  onBeforeStartPlaying
}) {
  const i18n = useI18n();
  let buttonLabel;

  if (accessibilityLabel) {
    buttonLabel = accessibilityLabel;
  } else if (videoLength) {
    const {
      hours,
      minutes,
      seconds
    } = secondsToTimeComponents(videoLength);
    buttonLabel = i18n.translate('Polaris.VideoThumbnail.playButtonA11yLabel.defaultWithDuration', {
      duration: i18n.translate(secondsToDurationTranslationKey(videoLength), {
        hourCount: hours,
        minuteCount: minutes,
        secondCount: seconds
      })
    });
  } else {
    buttonLabel = i18n.translate('Polaris.VideoThumbnail.playButtonA11yLabel.default');
  }

  const timeStampMarkup = videoLength ? /*#__PURE__*/React.createElement("p", {
    className: classNames(styles.Timestamp, showVideoProgress && styles.withProgress)
  }, secondsToTimestamp(videoLength)) : null;
  let progressMarkup = null;

  if (showVideoProgress) {
    const progressValue = calculateProgress(videoLength, videoProgress);
    const progressValuePercents = Math.round(progressValue * 100);
    /* eslint-disable @shopify/jsx-no-hardcoded-content */

    progressMarkup = /*#__PURE__*/React.createElement("div", {
      className: styles.Progress
    }, /*#__PURE__*/React.createElement("progress", {
      className: styles.ProgressBar,
      value: progressValuePercents,
      max: "100"
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.Indicator,
      style: {
        transform: `scaleX(${progressValue})`
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.Label
    }, progressValuePercents, "%")));
    /* eslint-enable @shopify/jsx-no-hardcoded-content */
  }

  return /*#__PURE__*/React.createElement("div", {
    className: styles.Thumbnail,
    style: {
      backgroundImage: `url(${thumbnailUrl})`
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.PlayButton,
    "aria-label": buttonLabel,
    onClick: onClick,
    onMouseEnter: onBeforeStartPlaying,
    onFocus: onBeforeStartPlaying,
    onTouchStart: onBeforeStartPlaying
  }, /*#__PURE__*/React.createElement("img", {
    className: styles.PlayIcon,
    src: PlayIcon,
    alt: ""
  })), timeStampMarkup, progressMarkup);
}

function calculateProgress(videoLength, videoProgress) {
  if (videoProgress > videoLength && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('Value passed to the video progress should not exceed video length. Resetting progress to 100%.');
  }

  if (videoProgress > 0 && videoLength > 0) {
    const progress = parseFloat((videoProgress / videoLength).toFixed(2));
    return progress > 1 ? 1 : progress;
  }

  return 0;
}

export { VideoThumbnail };
