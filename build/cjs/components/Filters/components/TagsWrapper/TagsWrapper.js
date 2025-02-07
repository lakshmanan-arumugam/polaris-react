'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var VisuallyHidden = require('../../../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function TagsWrapper({
  children,
  hidden
}) {
  if (hidden) {
    return /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, children);
  }

  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, children);
}

exports.TagsWrapper = TagsWrapper;
