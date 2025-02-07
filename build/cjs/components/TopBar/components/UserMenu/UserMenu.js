'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var UserMenu$1 = require('./UserMenu.scss.js');
var MessageIndicator = require('../../../MessageIndicator/MessageIndicator.js');
var Menu = require('../Menu/Menu.js');
var Avatar = require('../../../Avatar/Avatar.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function UserMenu({
  name,
  detail,
  avatar,
  initials,
  actions,
  message,
  onToggle,
  open,
  colorScheme,
  accessibilityLabel
}) {
  const showIndicator = Boolean(message);
  const activatorContentMarkup = /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(MessageIndicator.MessageIndicator, {
    active: showIndicator
  }, /*#__PURE__*/React__default['default'].createElement(Avatar.Avatar, {
    size: "small",
    source: avatar,
    initials: initials && initials.replace(' ', '')
  })), /*#__PURE__*/React__default['default'].createElement("span", {
    className: UserMenu$1['default'].Details
  }, /*#__PURE__*/React__default['default'].createElement("p", {
    className: UserMenu$1['default'].Name
  }, name), /*#__PURE__*/React__default['default'].createElement("p", {
    className: UserMenu$1['default'].Detail
  }, detail)));
  return /*#__PURE__*/React__default['default'].createElement(Menu.Menu, {
    activatorContent: activatorContentMarkup,
    open: open,
    onOpen: onToggle,
    onClose: onToggle,
    actions: actions,
    message: message,
    colorScheme: colorScheme,
    accessibilityLabel: accessibilityLabel
  });
}

exports.UserMenu = UserMenu;
