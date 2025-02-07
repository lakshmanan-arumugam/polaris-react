'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Card = require('../../Card.scss.js');
var ButtonGroup = require('../../../ButtonGroup/ButtonGroup.js');
var utils = require('../../../Button/utils.js');
var Stack = require('../../../Stack/Stack.js');
var Heading = require('../../../Heading/Heading.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Header({
  children,
  title,
  actions
}) {
  const actionMarkup = actions ? /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, null, utils.buttonsFrom(actions, {
    plain: true
  })) : null;
  const titleMarkup = /*#__PURE__*/React.isValidElement(title) ? title : /*#__PURE__*/React__default['default'].createElement(Heading.Heading, null, title);
  const headingMarkup = actionMarkup || children ? /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    alignment: "baseline"
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack.Item, {
    fill: true
  }, titleMarkup), actionMarkup, children) : titleMarkup;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: Card['default'].Header
  }, headingMarkup);
}

exports.Header = Header;
