'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var CloseButton$1 = require('./CloseButton.scss.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var Icon = require('../../../Icon/Icon.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function CloseButton({
  onClick
}) {
  const i18n = hooks.useI18n();
  return /*#__PURE__*/React__default['default'].createElement("button", {
    onClick: onClick,
    className: CloseButton$1['default'].CloseButton,
    "aria-label": i18n.translate('Polaris.Common.close')
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.MobileCancelMajor,
    color: "base"
  }));
}

exports.CloseButton = CloseButton;
