'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var withinContentContext = require('../../utilities/within-content-context.js');
var getWidth = require('../../utilities/get-width.js');
var context = require('./context.js');
var Navigation$1 = require('./Navigation.scss.js');
var Section = require('./components/Section/Section.js');
var hooks = require('../../utilities/theme/hooks.js');
var UnstyledLink = require('../UnstyledLink/UnstyledLink.js');
var Image = require('../Image/Image.js');
var Scrollable = require('../Scrollable/Scrollable.js');
var Item = require('./components/Item/Item.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const Navigation = function Navigation({
  children,
  contextControl,
  location,
  onDismiss,
  ariaLabelledBy
}) {
  const {
    logo
  } = hooks.useTheme();
  const width = getWidth.getWidth(logo, 104);
  const logoMarkup = logo ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation$1['default'].LogoContainer
  }, /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
    url: logo.url || '',
    className: Navigation$1['default'].LogoLink,
    style: {
      width
    }
  }, /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    source: logo.topBarSource || '',
    alt: logo.accessibilityLabel || '',
    className: Navigation$1['default'].Logo,
    style: {
      width
    }
  }))) : null;
  const mediaMarkup = contextControl ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation$1['default'].ContextControl
  }, contextControl) : logoMarkup;
  const context$1 = React.useMemo(() => ({
    location,
    onNavigationDismiss: onDismiss
  }), [location, onDismiss]);
  return /*#__PURE__*/React__default['default'].createElement(context.NavigationContext.Provider, {
    value: context$1
  }, /*#__PURE__*/React__default['default'].createElement(withinContentContext.WithinContentContext.Provider, {
    value: true
  }, /*#__PURE__*/React__default['default'].createElement("nav", {
    className: Navigation$1['default'].Navigation,
    "aria-labelledby": ariaLabelledBy
  }, mediaMarkup, /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable, {
    className: Navigation$1['default'].PrimaryNavigation
  }, children))));
};
Navigation.Item = Item.Item;
Navigation.Section = Section.Section;

exports.Navigation = Navigation;
