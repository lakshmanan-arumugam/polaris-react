'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Page$1 = require('./Page.scss.js');
var Header = require('./components/Header/Header.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Page({
  children,
  fullWidth,
  narrowWidth,
  divider,
  ...rest
}) {
  const pageClassName = css.classNames(Page$1['default'].Page, fullWidth && Page$1['default'].fullWidth, narrowWidth && Page$1['default'].narrowWidth);
  const hasHeaderContent = rest.title != null && rest.title !== '' || rest.primaryAction != null || rest.secondaryActions != null && rest.secondaryActions.length > 0 || rest.actionGroups != null && rest.actionGroups.length > 0 || rest.breadcrumbs != null && rest.breadcrumbs.length > 0;
  const contentClassName = css.classNames(Page$1['default'].Content, divider && hasHeaderContent && Page$1['default'].divider);
  const headerMarkup = hasHeaderContent ? /*#__PURE__*/React__default['default'].createElement(Header.Header, rest) : null;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: pageClassName
  }, headerMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: contentClassName
  }, children));
}

exports.Page = Page;
