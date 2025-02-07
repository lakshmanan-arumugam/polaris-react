'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var FormLayout = require('../../FormLayout.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Item(props) {
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: FormLayout['default'].Item
  }, props.children);
}

exports.Item = Item;
