import React from 'react';
import { handleMouseUpByBlurring } from '../../utilities/focus.js';
import { UnstyledLink } from '../UnstyledLink/UnstyledLink.js';

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
    onMouseUp: handleMouseUpByBlurring,
    onMouseEnter,
    onTouchStart
  };

  if (url) {
    buttonMarkup = disabled ?
    /*#__PURE__*/
    // Render an `<a>` so toggling disabled/enabled state changes only the
    // `href` attribute instead of replacing the whole element.
    React.createElement("a", commonProps, children) : /*#__PURE__*/React.createElement(UnstyledLink, Object.assign({}, interactiveProps, {
      url: url,
      external: external,
      download: download
    }, rest), children);
  } else {
    buttonMarkup = /*#__PURE__*/React.createElement("button", Object.assign({}, interactiveProps, {
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

export { UnstyledButton };
