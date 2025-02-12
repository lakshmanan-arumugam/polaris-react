'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var ActionList = require('../../ActionList.scss.js');
var focus = require('../../../../utilities/focus.js');
var Icon = require('../../../Icon/Icon.js');
var TextStyle = require('../../../TextStyle/TextStyle.js');
var Badge = require('../../../Badge/Badge.js');
var UnstyledLink = require('../../../UnstyledLink/UnstyledLink.js');
var Scrollable = require('../../../Scrollable/Scrollable.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const className = css.classNames(ActionList['default'].Item, disabled && ActionList['default'].disabled, destructive && ActionList['default'].destructive, active && ActionList['default'].active);
  let prefixMarkup = null;

  if (prefix) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("span", {
      className: ActionList['default'].Prefix
    }, prefix);
  } else if (icon) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("span", {
      className: ActionList['default'].Prefix
    }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
      source: icon
    }));
  } else if (image) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("span", {
      role: "presentation",
      className: ActionList['default'].Prefix,
      style: {
        backgroundImage: `url(${image}`
      }
    });
  }

  const contentText = ellipsis && content ? `${content}…` : content;
  const contentMarkup = helpText ? /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].ContentBlock
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].ContentBlockInner
  }, contentText), /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, helpText)) : contentText;
  const badgeMarkup = badge && /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].Suffix
  }, /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
    status: badge.status
  }, badge.content));
  const suffixMarkup = suffix && /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].Suffix
  }, suffix);
  const textMarkup = /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].Text
  }, contentMarkup);
  const contentElement = /*#__PURE__*/React__default['default'].createElement("span", {
    className: ActionList['default'].Content
  }, prefixMarkup, textMarkup, badgeMarkup, suffixMarkup);
  const scrollMarkup = active ? /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable.ScrollTo, null) : null;
  const control = url ? /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
    id: id,
    url: disabled ? null : url,
    className: className,
    external: external,
    "aria-label": accessibilityLabel,
    onClick: disabled ? null : onAction,
    role: role
  }, contentElement) : /*#__PURE__*/React__default['default'].createElement("button", {
    id: id,
    type: "button",
    className: className,
    disabled: disabled,
    "aria-label": accessibilityLabel,
    onClick: onAction,
    onMouseUp: focus.handleMouseUpByBlurring,
    role: role
  }, contentElement);
  return /*#__PURE__*/React__default['default'].createElement("li", {
    role: role === 'menuitem' ? 'presentation' : undefined
  }, scrollMarkup, control);
}

exports.Item = Item;
