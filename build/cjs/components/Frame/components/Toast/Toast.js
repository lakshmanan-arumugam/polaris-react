'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../../../utilities/css.js');
var types = require('../../../../types.js');
var Toast$1 = require('./Toast.scss.js');
var Icon = require('../../../Icon/Icon.js');
var Button = require('../../../Button/Button.js');
var ThemeProvider = require('../../../ThemeProvider/ThemeProvider.js');
var KeypressListener = require('../../../KeypressListener/KeypressListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const DEFAULT_TOAST_DURATION = 5000;
const DEFAULT_TOAST_DURATION_WITH_ACTION = 10000;
function Toast({
  content,
  onDismiss,
  duration,
  error,
  action
}) {
  React.useEffect(() => {
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
  const dismissMarkup = /*#__PURE__*/React__default['default'].createElement("button", {
    type: "button",
    className: Toast$1['default'].CloseButton,
    onClick: onDismiss
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.MobileCancelMajor
  }));
  const actionMarkup = action ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Toast$1['default'].Action
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    monochrome: true,
    onClick: action.onAction
  }, action.content)) : null;
  const className = css.classNames(Toast$1['default'].Toast, error && Toast$1['default'].error);
  return /*#__PURE__*/React__default['default'].createElement(ThemeProvider.ThemeProvider, {
    theme: {
      colorScheme: 'inverse'
    }
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
    keyCode: types.Key.Escape,
    handler: onDismiss
  }), content, actionMarkup, dismissMarkup));
}

exports.DEFAULT_TOAST_DURATION = DEFAULT_TOAST_DURATION;
exports.DEFAULT_TOAST_DURATION_WITH_ACTION = DEFAULT_TOAST_DURATION_WITH_ACTION;
exports.Toast = Toast;
