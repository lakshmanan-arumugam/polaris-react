'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Caption$1 = require('./Caption.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Caption({
  children
}) {
  return /*#__PURE__*/React__default['default'].createElement("p", {
    className: Caption$1['default'].Caption
  }, children);
}

exports.Caption = Caption;
