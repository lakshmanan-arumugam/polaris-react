import React, { useEffect } from 'react';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { Key } from '../../../../types.js';
import styles from './Toast.scss.js';
import { Icon } from '../../../Icon/Icon.js';
import { Button } from '../../../Button/Button.js';
import { ThemeProvider } from '../../../ThemeProvider/ThemeProvider.js';
import { KeypressListener } from '../../../KeypressListener/KeypressListener.js';

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_TOAST_DURATION_WITH_ACTION = 10000;
function Toast({
  content,
  onDismiss,
  duration,
  error,
  action
}) {
  useEffect(() => {
    let timeoutDuration = duration || DEFAULT_TOAST_DURATION;

    if (action && !duration) {
      timeoutDuration = DEFAULT_TOAST_DURATION_WITH_ACTION;
    } else if (action && duration && duration < DEFAULT_TOAST_DURATION_WITH_ACTION) {
      // eslint-disable-next-line no-console
      console.log('Toast with action should persist for at least 10,000 milliseconds to give the merchant enough time to act on it.');
    }

    const timer = setTimeout(onDismiss, timeoutDuration);
    return () => {
      clearTimeout(timer);
    };
  }, [action, duration, onDismiss]);
  const dismissMarkup = /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.CloseButton,
    onClick: onDismiss
  }, /*#__PURE__*/React.createElement(Icon, {
    source: MobileCancelMajor
  }));
  const actionMarkup = action ? /*#__PURE__*/React.createElement("div", {
    className: styles.Action
  }, /*#__PURE__*/React.createElement(Button, {
    plain: true,
    monochrome: true,
    onClick: action.onAction
  }, action.content)) : null;
  const className = classNames(styles.Toast, error && styles.error);
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: {
      colorScheme: 'inverse'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement(KeypressListener, {
    keyCode: Key.Escape,
    handler: onDismiss
  }), content, actionMarkup, dismissMarkup));
}

export { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_DURATION_WITH_ACTION, Toast };
