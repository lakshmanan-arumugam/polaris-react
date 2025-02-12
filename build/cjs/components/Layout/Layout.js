'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Layout$1 = require('./Layout.scss.js');
var AnnotatedSection = require('./components/AnnotatedSection/AnnotatedSection.js');
var Section = require('./components/Section/Section.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const Layout = function Layout({
  sectioned,
  children
}) {
  const content = sectioned ? /*#__PURE__*/React__default['default'].createElement(Section.Section, null, children) : children;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout$1['default'].Layout
  }, content);
};
Layout.AnnotatedSection = AnnotatedSection.AnnotatedSection;
Layout.Section = Section.Section;

exports.Layout = Layout;
