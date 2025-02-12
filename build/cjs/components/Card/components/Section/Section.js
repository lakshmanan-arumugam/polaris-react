'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var Card = require('../../Card.scss.js');
var Subheading = require('../../../Subheading/Subheading.js');
var ButtonGroup = require('../../../ButtonGroup/ButtonGroup.js');
var utils = require('../../../Button/utils.js');
var Stack = require('../../../Stack/Stack.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Section({
  children,
  title,
  subdued,
  flush,
  fullWidth,
  actions,
  hideOnPrint
}) {
  const className = css.classNames(Card['default'].Section, flush && Card['default']['Section-flush'], subdued && Card['default']['Section-subdued'], fullWidth && Card['default']['Section-fullWidth'], hideOnPrint && Card['default']['Section-hideOnPrint']);
  const actionMarkup = actions ? /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, null, utils.buttonsFrom(actions, {
    plain: true
  })) : null;
  const titleMarkup = typeof title === 'string' ? /*#__PURE__*/React__default['default'].createElement(Subheading.Subheading, null, title) : title;
  const titleAreaMarkup = titleMarkup || actionMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Card['default'].SectionHeader
  }, actionMarkup ? /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    alignment: "baseline"
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack.Item, {
    fill: true
  }, titleMarkup), actionMarkup) : titleMarkup) : null;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, titleAreaMarkup, children);
}

exports.Section = Section;
