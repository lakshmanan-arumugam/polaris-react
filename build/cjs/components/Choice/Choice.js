'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Choice$1 = require('./Choice.scss.js');
var InlineError = require('../InlineError/InlineError.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Choice({
  id,
  label,
  disabled,
  error,
  children,
  labelHidden,
  helpText,
  onClick,
  onMouseOut,
  onMouseOver
}) {
  const className = css.classNames(Choice$1['default'].Choice, labelHidden && Choice$1['default'].labelHidden, disabled && Choice$1['default'].disabled);
  const labelMarkup = /*#__PURE__*/React__default['default'].createElement("label", {
    className: className,
    htmlFor: id,
    onClick: onClick,
    onMouseOver: onMouseOver,
    onMouseOut: onMouseOut
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Choice$1['default'].Control
  }, children), /*#__PURE__*/React__default['default'].createElement("span", {
    className: Choice$1['default'].Label
  }, label));
  const helpTextMarkup = helpText ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Choice$1['default'].HelpText,
    id: helpTextID(id)
  }, helpText) : null;
  const errorMarkup = error && typeof error !== 'boolean' && /*#__PURE__*/React__default['default'].createElement("div", {
    className: Choice$1['default'].Error
  }, /*#__PURE__*/React__default['default'].createElement(InlineError.InlineError, {
    message: error,
    fieldID: id
  }));
  const descriptionMarkup = helpTextMarkup || errorMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Choice$1['default'].Descriptions
  }, errorMarkup, helpTextMarkup) : null;
  return descriptionMarkup ? /*#__PURE__*/React__default['default'].createElement("div", null, labelMarkup, descriptionMarkup) : labelMarkup;
}
function helpTextID(id) {
  return `${id}HelpText`;
}

exports.Choice = Choice;
exports.helpTextID = helpTextID;
