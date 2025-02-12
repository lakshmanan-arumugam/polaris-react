import React from 'react';
import { classNames, variationName } from '../../utilities/css.js';
import styles from './ProgressBar.scss.js';
import { useI18n } from '../../utilities/i18n/hooks.js';

function ProgressBar({
  progress = 0,
  size = 'medium',
  color = 'highlight',
  animated = true
}) {
  const i18n = useI18n();
  const className = classNames(styles.ProgressBar, size && styles[variationName('size', size)], color && styles[variationName('color', color)]);
  const warningMessage = i18n.translate(progress < 0 ? 'Polaris.ProgressBar.negativeWarningMessage' : 'Polaris.ProgressBar.exceedWarningMessage', {
    progress
  });
  const parsedProgress = parseProgress(progress, warningMessage);
  /* eslint-disable @shopify/jsx-no-hardcoded-content */

  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("progress", {
    className: styles.Progress,
    value: parsedProgress,
    max: "100"
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.Indicator, animated && styles.Animated),
    style: {
      width: `${parsedProgress}%`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Label
  }, parsedProgress, "%")))
  /* eslint-enable @shopify/jsx-no-hardcoded-content */
  ;
}

function parseProgress(progress, warningMessage) {
  let progressWidth;

  if (progress < 0) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(warningMessage);
    }

    progressWidth = 0;
  } else if (progress > 100) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(warningMessage);
    }

    progressWidth = 100;
  } else {
    progressWidth = progress;
  }

  return progressWidth;
}

export { ProgressBar };
