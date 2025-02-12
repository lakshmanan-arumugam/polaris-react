'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var VisuallyHidden$1 = require('./VisuallyHidden.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function VisuallyHidden({
  children
}) {
  return /*#__PURE__*/React__default['default'].createElement("span", {
    className: VisuallyHidden$1['default'].VisuallyHidden
  }, children);
}

exports.VisuallyHidden = VisuallyHidden;
