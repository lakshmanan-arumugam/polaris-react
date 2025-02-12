'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Header$1 = require('./Header.scss.js');
var hooks = require('../Section/hooks.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Header({
  children
}) {
  const sectionId = hooks.useSection() || '';
  const content = typeof children === 'string' ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].Header
  }, children) : children;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    "aria-hidden": true,
    id: sectionId
  }, content);
}

exports.Header = Header;
