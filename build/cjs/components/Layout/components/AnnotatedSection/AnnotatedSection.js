'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Layout = require('../../Layout.scss.js');
var TextContainer = require('../../../TextContainer/TextContainer.js');
var Heading = require('../../../Heading/Heading.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function AnnotatedSection(props) {
  const {
    children,
    title,
    description,
    id
  } = props;
  const descriptionMarkup = typeof description === 'string' ? /*#__PURE__*/React__default['default'].createElement("p", null, description) : description;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout['default'].AnnotatedSection
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout['default'].AnnotationWrapper
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout['default'].Annotation
  }, /*#__PURE__*/React__default['default'].createElement(TextContainer.TextContainer, null, /*#__PURE__*/React__default['default'].createElement(Heading.Heading, {
    id: id
  }, title), descriptionMarkup && /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout['default'].AnnotationDescription
  }, descriptionMarkup))), /*#__PURE__*/React__default['default'].createElement("div", {
    className: Layout['default'].AnnotationContent
  }, children)));
}

exports.AnnotatedSection = AnnotatedSection;
