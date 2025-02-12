'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var focus = require('../../utilities/focus.js');
var UnstyledLink = require('../UnstyledLink/UnstyledLink.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function UnstyledButton({
  id,
  children,
  className,
  url,
  external,
  download,
  submit,
  disabled,
  loading,
  pressed,
  accessibilityLabel,
  role,
  ariaControls,
  ariaExpanded,
  ariaDescribedBy,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onTouchStart,
  ...rest
}) {
  let buttonMarkup;
  const commonProps = {
    id,
    className,
    'aria-label': accessibilityLabel
  };
  const interactiveProps = { ...commonProps,
    role,
    onClick,
    onFocus,
    onBlur,
    onMouseUp: focus.handleMouseUpByBlurring,
    onMouseEnter,
    onTouchStart
  };

  if (url) {
    buttonMarkup = disabled ?
    /*#__PURE__*/
    // Render an `<a>` so toggling disabled/enabled state changes only the
    // `href` attribute instead of replacing the whole element.
    React__default['default'].createElement("a", commonProps, children) : /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, Object.assign({}, interactiveProps, {
      url: url,
      external: external,
      download: download
    }, rest), children);
  } else {
    buttonMarkup = /*#__PURE__*/React__default['default'].createElement("button", Object.assign({}, interactiveProps, {
      type: submit ? 'submit' : 'button',
      disabled: disabled,
      "aria-busy": loading ? true : undefined,
      "aria-controls": ariaControls,
      "aria-expanded": ariaExpanded,
      "aria-describedby": ariaDescribedBy,
      "aria-pressed": pressed,
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      onKeyPress: onKeyPress
    }, rest), children);
  }

  return buttonMarkup;
}

exports.UnstyledButton = UnstyledButton;
