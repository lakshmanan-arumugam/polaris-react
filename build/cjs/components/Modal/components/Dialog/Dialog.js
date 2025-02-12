'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisTokens = require('@shopify/polaris-tokens');
var reactTransitionGroup = require('react-transition-group');
var css = require('../../../../utilities/css.js');
var focus = require('../../../../utilities/focus.js');
var types = require('../../../../types.js');
var Dialog$1 = require('./Dialog.scss.js');
var TrapFocus = require('../../../TrapFocus/TrapFocus.js');
var KeypressListener = require('../../../KeypressListener/KeypressListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Dialog({
  instant,
  labelledBy,
  children,
  onClose,
  onExited,
  onEntered,
  large,
  small,
  limitHeight,
  ...props
}) {
  const containerNode = React.useRef(null);
  const classes = css.classNames(Dialog$1['default'].Modal, small && Dialog$1['default'].sizeSmall, large && Dialog$1['default'].sizeLarge, limitHeight && Dialog$1['default'].limitHeight);
  const TransitionChild = instant ? reactTransitionGroup.Transition : FadeUp;
  React.useEffect(() => {
    containerNode.current && !containerNode.current.contains(document.activeElement) && focus.focusFirstFocusableNode(containerNode.current);
  }, []);
  return /*#__PURE__*/React__default['default'].createElement(TransitionChild, Object.assign({}, props, {
    nodeRef: containerNode,
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: polarisTokens.durationBase,
    onEntered: onEntered,
    onExited: onExited
  }), /*#__PURE__*/React__default['default'].createElement("div", {
    className: Dialog$1['default'].Container,
    "data-polaris-layer": true,
    "data-polaris-overlay": true,
    ref: containerNode
  }, /*#__PURE__*/React__default['default'].createElement(TrapFocus.TrapFocus, null, /*#__PURE__*/React__default['default'].createElement("div", {
    role: "dialog",
    "aria-modal": true,
    "aria-labelledby": labelledBy,
    tabIndex: -1,
    className: Dialog$1['default'].Dialog
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: classes
  }, /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
    keyCode: types.Key.Escape,
    handler: onClose
  }), children)))));
}
const fadeUpClasses = {
  appear: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].entering),
  appearActive: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].entered),
  enter: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].entering),
  enterActive: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].entered),
  exit: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].exiting),
  exitActive: css.classNames(Dialog$1['default'].animateFadeUp, Dialog$1['default'].exited)
};

function FadeUp({
  children,
  ...props
}) {
  return /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.CSSTransition, Object.assign({}, props, {
    classNames: fadeUpClasses
  }), children);
}

exports.Dialog = Dialog;
