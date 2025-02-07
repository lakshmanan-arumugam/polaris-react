'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Subheading$1 = require('./Subheading.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Subheading({
  element: Element = 'h3',
  children
}) {
  const ariaLabel = typeof children === 'string' ? children : undefined;
  return /*#__PURE__*/React__default['default'].createElement(Element, {
    "aria-label": ariaLabel,
    className: Subheading$1['default'].Subheading
  }, children);
}

exports.Subheading = Subheading;
