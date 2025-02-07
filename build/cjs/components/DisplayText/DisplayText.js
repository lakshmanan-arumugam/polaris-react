'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var DisplayText$1 = require('./DisplayText.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function DisplayText({
  element: Element = 'p',
  children,
  size = 'medium'
}) {
  const className = css.classNames(DisplayText$1['default'].DisplayText, size && DisplayText$1['default'][css.variationName('size', size)]);
  return /*#__PURE__*/React__default['default'].createElement(Element, {
    className: className
  }, children);
}

exports.DisplayText = DisplayText;
