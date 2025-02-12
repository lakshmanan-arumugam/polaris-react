'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var getWidth = require('../../utilities/get-width.js');
var useToggle = require('../../utilities/use-toggle.js');
var TopBar$1 = require('./TopBar.scss.js');
var Search = require('./components/Search/Search.js');
var SearchField = require('./components/SearchField/SearchField.js');
var UserMenu = require('./components/UserMenu/UserMenu.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/theme/hooks.js');
var Icon = require('../Icon/Icon.js');
var UnstyledLink = require('../UnstyledLink/UnstyledLink.js');
var Image = require('../Image/Image.js');
var Menu = require('./components/Menu/Menu.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
const TopBar = function TopBar({
  showNavigationToggle,
  userMenu,
  searchResults,
  searchField,
  secondaryMenu,
  searchResultsVisible,
  searchResultsOverlayVisible = false,
  onNavigationToggle,
  onSearchResultsDismiss,
  contextControl
}) {
  const i18n = hooks.useI18n();
  const {
    logo
  } = hooks$1.useTheme();
  const {
    value: focused,
    setTrue: forceTrueFocused,
    setFalse: forceFalseFocused
  } = useToggle.useToggle(false);
  const iconClassName = css.classNames(TopBar$1['default'].NavigationIcon, focused && TopBar$1['default'].focused);
  const navigationButtonMarkup = showNavigationToggle ? /*#__PURE__*/React__default['default'].createElement("button", {
    type: "button",
    className: iconClassName,
    onClick: onNavigationToggle,
    onFocus: forceTrueFocused,
    onBlur: forceFalseFocused,
    "aria-label": i18n.translate('Polaris.TopBar.toggleMenuLabel')
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.MobileHamburgerMajor
  })) : null;
  const width = getWidth.getWidth(logo, 104);
  let contextMarkup;

  if (contextControl) {
    contextMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: TopBar$1['default'].ContextControl
    }, contextControl);
  } else if (logo) {
    const className = css.classNames(TopBar$1['default'].LogoContainer, showNavigationToggle || searchField ? TopBar$1['default'].LogoDisplayControl : TopBar$1['default'].LogoDisplayContainer);
    contextMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: className
    }, /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
      url: logo.url || '',
      className: TopBar$1['default'].LogoLink,
      style: {
        width
      }
    }, /*#__PURE__*/React__default['default'].createElement(Image.Image, {
      source: logo.topBarSource || '',
      alt: logo.accessibilityLabel || '',
      className: TopBar$1['default'].Logo,
      style: {
        width
      }
    })));
  }

  const searchMarkup = searchField ? /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, searchField, /*#__PURE__*/React__default['default'].createElement(Search.Search, {
    visible: searchResultsVisible,
    onDismiss: onSearchResultsDismiss,
    overlayVisible: searchResultsOverlayVisible
  }, searchResults)) : null;
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: TopBar$1['default'].TopBar
  }, navigationButtonMarkup, contextMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: TopBar$1['default'].Contents
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: TopBar$1['default'].SearchField
  }, searchMarkup), /*#__PURE__*/React__default['default'].createElement("div", {
    className: TopBar$1['default'].SecondaryMenu
  }, secondaryMenu), userMenu));
};
TopBar.Menu = Menu.Menu;
TopBar.SearchField = SearchField.SearchField;
TopBar.UserMenu = UserMenu.UserMenu;

exports.TopBar = TopBar;
