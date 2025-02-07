'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var duration = require('../../utilities/duration.js');
var VideoThumbnail$1 = require('./VideoThumbnail.scss.js');
var play = require('./illustrations/play.svg.js');
var hooks = require('../../utilities/i18n/hooks.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function VideoThumbnail({
  thumbnailUrl,
  videoLength = 0,
  videoProgress = 0,
  showVideoProgress = false,
  accessibilityLabel,
  onClick,
  onBeforeStartPlaying
}) {
  const i18n = hooks.useI18n();
  let buttonLabel;

  if (accessibilityLabel) {
    buttonLabel = accessibilityLabel;
  } else if (videoLength) {
    const {
      hours,
      minutes,
      seconds
    } = duration.secondsToTimeComponents(videoLength);
    buttonLabel = i18n.translate('Polaris.VideoThumbnail.playButtonA11yLabel.defaultWithDuration', {
      duration: i18n.translate(duration.secondsToDurationTranslationKey(videoLength), {
        hourCount: hours,
        minuteCount: minutes,
        secondCount: seconds
      })
    });
  } else {
    buttonLabel = i18n.translate('Polaris.VideoThumbnail.playButtonA11yLabel.default');
  }

  const timeStampMarkup = videoLength ? /*#__PURE__*/React__default['default'].createElement("p", {
    className: css.classNames(VideoThumbnail$1['default'].Timestamp, showVideoProgress && VideoThumbnail$1['default'].withProgress)
  }, duration.secondsToTimestamp(videoLength)) : null;
  let progressMarkup = null;

  if (showVideoProgress) {
    const progressValue = calculateProgress(videoLength, videoProgress);
    const progressValuePercents = Math.round(progressValue * 100);
    /* eslint-disable @shopify/jsx-no-hardcoded-content */

    progressMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: VideoThumbnail$1['default'].Progress
    }, /*#__PURE__*/React__default['default'].createElement("progress", {
      className: VideoThumbnail$1['default'].ProgressBar,
      value: progressValuePercents,
      max: "100"
    }), /*#__PURE__*/React__default['default'].createElement("div", {
      className: VideoThumbnail$1['default'].Indicator,
      style: {
        transform: `scaleX(${progressValue})`
      }
    }, /*#__PURE__*/React__default['default'].createElement("span", {
      className: VideoThumbnail$1['default'].Label
    }, progressValuePercents, "%")));
    /* eslint-enable @shopify/jsx-no-hardcoded-content */
  }

  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: VideoThumbnail$1['default'].Thumbnail,
    style: {
      backgroundImage: `url(${thumbnailUrl})`
    }
  }, /*#__PURE__*/React__default['default'].createElement("button", {
    type: "button",
    className: VideoThumbnail$1['default'].PlayButton,
    "aria-label": buttonLabel,
    onClick: onClick,
    onMouseEnter: onBeforeStartPlaying,
    onFocus: onBeforeStartPlaying,
    onTouchStart: onBeforeStartPlaying
  }, /*#__PURE__*/React__default['default'].createElement("img", {
    className: VideoThumbnail$1['default'].PlayIcon,
    src: play['default'],
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

exports.VideoThumbnail = VideoThumbnail;
