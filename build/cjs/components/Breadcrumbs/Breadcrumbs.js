'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var focus = require('../../utilities/focus.js');
var Breadcrumbs$1 = require('./Breadcrumbs.scss.js');
var Icon = require('../Icon/Icon.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');
var UnstyledLink = require('../UnstyledLink/UnstyledLink.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Breadcrumbs({
  breadcrumbs
}) {
  const breadcrumb = breadcrumbs[breadcrumbs.length - 1];

  if (breadcrumb == null) {
    return null;
  }

  const {
    content
  } = breadcrumb;
  const contentMarkup = /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Breadcrumbs$1['default'].Icon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.ArrowLeftMinor
  })), /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, content));
  const breadcrumbMarkup = 'url' in breadcrumb ? /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
    key: content,
    url: breadcrumb.url,
    className: Breadcrumbs$1['default'].Breadcrumb,
    onMouseUp: focus.handleMouseUpByBlurring,
    "aria-label": breadcrumb.accessibilityLabel
  }, contentMarkup) : /*#__PURE__*/React__default['default'].createElement("button", {
    key: content,
    className: Breadcrumbs$1['default'].Breadcrumb,
    onClick: breadcrumb.onAction,
    onMouseUp: focus.handleMouseUpByBlurring,
    type: "button",
    "aria-label": breadcrumb.accessibilityLabel
  }, contentMarkup);
  return /*#__PURE__*/React__default['default'].createElement("nav", {
    role: "navigation"
  }, breadcrumbMarkup);
}

exports.Breadcrumbs = Breadcrumbs;
