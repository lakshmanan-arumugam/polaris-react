'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var DisplayText = require('../DisplayText/DisplayText.js');
var emptySearch = require('./illustrations/empty-search.svg.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Stack = require('../Stack/Stack.js');
var TextStyle = require('../TextStyle/TextStyle.js');
var Image = require('../Image/Image.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function EmptySearchResult({
  title,
  description,
  withIllustration
}) {
  const i18n = hooks.useI18n();
  const altText = i18n.translate('Polaris.EmptySearchResult.altText');
  const descriptionMarkup = description ? /*#__PURE__*/React__default['default'].createElement("p", null, description) : null;
  const illustrationMarkup = withIllustration ? /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    alt: altText,
    source: emptySearch['default'],
    draggable: false
  }) : null;
  return /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    alignment: "center",
    vertical: true
  }, illustrationMarkup, /*#__PURE__*/React__default['default'].createElement(DisplayText.DisplayText, {
    size: "small"
  }, title), /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, descriptionMarkup));
}

exports.EmptySearchResult = EmptySearchResult;
