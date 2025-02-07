'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../../../utilities/css.js');
var DataTable = require('../../DataTable.scss.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var Button = require('../../../Button/Button.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Navigation({
  columnVisibilityData,
  isScrolledFarthestLeft,
  isScrolledFarthestRight,
  navigateTableLeft,
  navigateTableRight
}) {
  const i18n = hooks.useI18n();
  const pipMarkup = columnVisibilityData.map((column, index) => {
    const className = css.classNames(DataTable['default'].Pip, column.isVisible && DataTable['default']['Pip-visible']);
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: className,
      key: `pip-${index}`
    });
  });
  const leftA11yLabel = i18n.translate('Polaris.DataTable.navAccessibilityLabel', {
    direction: 'left'
  });
  const rightA11yLabel = i18n.translate('Polaris.DataTable.navAccessibilityLabel', {
    direction: 'right'
  });
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: DataTable['default'].Navigation
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    icon: polarisIcons.ChevronLeftMinor,
    disabled: isScrolledFarthestLeft,
    accessibilityLabel: leftA11yLabel,
    onClick: navigateTableLeft
  }), pipMarkup, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    icon: polarisIcons.ChevronRightMinor,
    disabled: isScrolledFarthestRight,
    accessibilityLabel: rightA11yLabel,
    onClick: navigateTableRight
  }));
}

exports.Navigation = Navigation;
