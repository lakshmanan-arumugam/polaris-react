'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Message$1 = require('./Message.scss.js');
var Link = require('../../../../../Link/Link.js');
var Badge = require('../../../../../Badge/Badge.js');
var Popover = require('../../../../../Popover/Popover.js');
var Stack = require('../../../../../Stack/Stack.js');
var TextContainer = require('../../../../../TextContainer/TextContainer.js');
var Heading = require('../../../../../Heading/Heading.js');
var Button = require('../../../../../Button/Button.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Message({
  title,
  description,
  action,
  link,
  badge
}) {
  const badgeMarkup = badge && /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
    status: badge.status
  }, badge.content);
  const {
    to,
    content: linkContent
  } = link;
  const {
    onClick,
    content: actionContent
  } = action;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: Message$1['default'].Section
  }, /*#__PURE__*/React__default['default'].createElement(Popover.Popover.Section, null, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    vertical: true,
    spacing: "tight"
  }, /*#__PURE__*/React__default['default'].createElement(TextContainer.TextContainer, null, /*#__PURE__*/React__default['default'].createElement(Heading.Heading, null, title, badgeMarkup), /*#__PURE__*/React__default['default'].createElement("p", null, description)), /*#__PURE__*/React__default['default'].createElement(Link.Link, {
    url: to
  }, linkContent), /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    onClick: onClick
  }, actionContent))));
}

exports.Message = Message;
