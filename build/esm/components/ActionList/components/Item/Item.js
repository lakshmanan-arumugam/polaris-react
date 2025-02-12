import React from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../ActionList.scss.js';
import { handleMouseUpByBlurring } from '../../../../utilities/focus.js';
import { Icon } from '../../../Icon/Icon.js';
import { TextStyle } from '../../../TextStyle/TextStyle.js';
import { Badge } from '../../../Badge/Badge.js';
import { UnstyledLink } from '../../../UnstyledLink/UnstyledLink.js';
import { Scrollable } from '../../../Scrollable/Scrollable.js';

function Item({
  id,
  badge,
  content,
  accessibilityLabel,
  helpText,
  url,
  onAction,
  icon,
  image,
  prefix,
  suffix,
  disabled,
  external,
  destructive,
  ellipsis,
  active,
  role
}) {
  const className = classNames(styles.Item, disabled && styles.disabled, destructive && styles.destructive, active && styles.active);
  let prefixMarkup = null;

  if (prefix) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      className: styles.Prefix
    }, prefix);
  } else if (icon) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      className: styles.Prefix
    }, /*#__PURE__*/React.createElement(Icon, {
      source: icon
    }));
  } else if (image) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      role: "presentation",
      className: styles.Prefix,
      style: {
        backgroundImage: `url(${image}`
      }
    });
  }

  const contentText = ellipsis && content ? `${content}…` : content;
  const contentMarkup = helpText ? /*#__PURE__*/React.createElement("span", {
    className: styles.ContentBlock
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.ContentBlockInner
  }, contentText), /*#__PURE__*/React.createElement(TextStyle, {
    variation: "subdued"
  }, helpText)) : contentText;
  const badgeMarkup = badge && /*#__PURE__*/React.createElement("span", {
    className: styles.Suffix
  }, /*#__PURE__*/React.createElement(Badge, {
    status: badge.status
  }, badge.content));
  const suffixMarkup = suffix && /*#__PURE__*/React.createElement("span", {
    className: styles.Suffix
  }, suffix);
  const textMarkup = /*#__PURE__*/React.createElement("span", {
    className: styles.Text
  }, contentMarkup);
  const contentElement = /*#__PURE__*/React.createElement("span", {
    className: styles.Content
  }, prefixMarkup, textMarkup, badgeMarkup, suffixMarkup);
  const scrollMarkup = active ? /*#__PURE__*/React.createElement(Scrollable.ScrollTo, null) : null;
  const control = url ? /*#__PURE__*/React.createElement(UnstyledLink, {
    id: id,
    url: disabled ? null : url,
    className: className,
    external: external,
    "aria-label": accessibilityLabel,
    onClick: disabled ? null : onAction,
    role: role
  }, contentElement) : /*#__PURE__*/React.createElement("button", {
    id: id,
    type: "button",
    className: className,
    disabled: disabled,
    "aria-label": accessibilityLabel,
    onClick: onAction,
    onMouseUp: handleMouseUpByBlurring,
    role: role
  }, contentElement);
  return /*#__PURE__*/React.createElement("li", {
    role: role === 'menuitem' ? 'presentation' : undefined
  }, scrollMarkup, control);
}

export { Item };
