'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Heading$1 = require('./Heading.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Heading({
  element: Element = 'h2',
  children,
  id
}) {
  return /*#__PURE__*/React__default['default'].createElement(Element, {
    className: Heading$1['default'].Heading,
    id: id
  }, children);
}

exports.Heading = Heading;
