'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Labelled$1 = require('./Labelled.scss.js');
var InlineError = require('../InlineError/InlineError.js');
var Label = require('../Label/Label.js');
var utils = require('../Button/utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Labelled({
  id,
  label,
  error,
  action,
  helpText,
  children,
  labelHidden,
  requiredIndicator,
  ...rest
}) {
  const className = css.classNames(labelHidden && Labelled$1['default'].hidden);
  const actionMarkup = action ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Labelled$1['default'].Action
  }, utils.buttonFrom(action, {
    plain: true
  })) : null;
  const helpTextMarkup = helpText ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Labelled$1['default'].HelpText,
    id: helpTextID(id)
  }, helpText) : null;
  const errorMarkup = error && typeof error !== 'boolean' && /*#__PURE__*/React__default['default'].createElement("div", {
    className: Labelled$1['default'].Error
  }, /*#__PURE__*/React__default['default'].createElement(InlineError.InlineError, {
    message: error,
    fieldID: id
  }));
  const labelMarkup = label ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Labelled$1['default'].LabelWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Label.Label, Object.assign({
    id: id,
    requiredIndicator: requiredIndicator
  }, rest, {
    hidden: false
  }), label), actionMarkup) : null;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, labelMarkup, children, errorMarkup, helpTextMarkup);
}
function helpTextID(id) {
  return `${id}HelpText`;
}

exports.labelID = Label.labelID;
exports.Labelled = Labelled;
exports.helpTextID = helpTextID;
