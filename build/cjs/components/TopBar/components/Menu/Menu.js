'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Menu$1 = require('./Menu.scss.js');
var Message = require('./components/Message/Message.js');
var Popover = require('../../../Popover/Popover.js');
var ActionList = require('../../../ActionList/ActionList.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Menu(props) {
  const {
    actions,
    onOpen,
    onClose,
    open,
    activatorContent,
    message,
    colorScheme,
    accessibilityLabel
  } = props;
  const badgeProps = message && message.badge && {
    content: message.badge.content,
    status: message.badge.status
  };
  const messageMarkup = message && /*#__PURE__*/React__default['default'].createElement(Message.Message, {
    title: message.title,
    description: message.description,
    action: {
      onClick: message.action.onClick,
      content: message.action.content
    },
    link: {
      to: message.link.to,
      content: message.link.content
    },
    badge: badgeProps
  });
  const isFullHeight = Boolean(message);
  return /*#__PURE__*/React__default['default'].createElement(Popover.Popover, {
    activator: /*#__PURE__*/React__default['default'].createElement("div", {
      className: Menu$1['default'].ActivatorWrapper
    }, /*#__PURE__*/React__default['default'].createElement("button", {
      type: "button",
      className: Menu$1['default'].Activator,
      onClick: onOpen,
      "aria-label": accessibilityLabel
    }, activatorContent)),
    active: open,
    onClose: onClose,
    fixed: true,
    fullHeight: isFullHeight,
    preferredAlignment: "right",
    colorScheme: colorScheme
  }, /*#__PURE__*/React__default['default'].createElement(ActionList.ActionList, {
    onActionAnyItem: onClose,
    sections: actions
  }), messageMarkup);
}

exports.Menu = Menu;
