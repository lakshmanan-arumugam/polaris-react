'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var merge = require('../../utilities/merge.js');
var utils = require('../../utilities/theme/utils.js');
var I18n = require('../../utilities/i18n/I18n.js');
var scrollLockManager = require('../../utilities/scroll-lock-manager/scroll-lock-manager.js');
var stickyManager = require('../../utilities/sticky-manager/sticky-manager.js');
var uniqueIdFactory = require('../../utilities/unique-id/unique-id-factory.js');
var context = require('../../utilities/features/context.js');
var context$1 = require('../../utilities/i18n/context.js');
var context$2 = require('../../utilities/scroll-lock-manager/context.js');
var context$3 = require('../../utilities/sticky-manager/context.js');
var context$4 = require('../../utilities/unique-id/context.js');
var context$5 = require('../../utilities/link/context.js');
var context$6 = require('../../utilities/theme/context.js');
var context$7 = require('../../utilities/media-query/context.js');
var PortalsManager = require('../PortalsManager/PortalsManager.js');
var FocusManager = require('../FocusManager/FocusManager.js');
var context$8 = require('../../utilities/frame/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const defaultMediaQuery = {
  isNavigationCollapsed: false
};
function PolarisTestProvider({
  strict,
  children,
  i18n,
  link,
  theme = {},
  mediaQuery,
  features = {},
  frame
}) {
  const Wrapper = strict ? React.StrictMode : React.Fragment;
  const intl = React.useMemo(() => new I18n.I18n(i18n || {}), [i18n]);
  const scrollLockManager$1 = React.useMemo(() => new scrollLockManager.ScrollLockManager(), []);
  const stickyManager$1 = React.useMemo(() => new stickyManager.StickyManager(), []);
  const uniqueIdFactory$1 = React.useMemo(() => new uniqueIdFactory.UniqueIdFactory(uniqueIdFactory.globalIdGeneratorFactory), []);
  const processedThemeConfig = { ...theme,
    colorScheme: 'light'
  };
  const customProperties = utils.buildCustomProperties(processedThemeConfig);
  const mergedTheme = utils.buildThemeContext(processedThemeConfig, customProperties);
  const mergedFrame = createFrameContext(frame);
  const mergedMediaQuery = merge.merge(defaultMediaQuery, mediaQuery);
  return /*#__PURE__*/React__default['default'].createElement(Wrapper, null, /*#__PURE__*/React__default['default'].createElement(context.FeaturesContext.Provider, {
    value: features
  }, /*#__PURE__*/React__default['default'].createElement(context$1.I18nContext.Provider, {
    value: intl
  }, /*#__PURE__*/React__default['default'].createElement(context$2.ScrollLockManagerContext.Provider, {
    value: scrollLockManager$1
  }, /*#__PURE__*/React__default['default'].createElement(context$3.StickyManagerContext.Provider, {
    value: stickyManager$1
  }, /*#__PURE__*/React__default['default'].createElement(context$4.UniqueIdFactoryContext.Provider, {
    value: uniqueIdFactory$1
  }, /*#__PURE__*/React__default['default'].createElement(context$5.LinkContext.Provider, {
    value: link
  }, /*#__PURE__*/React__default['default'].createElement(context$6.ThemeContext.Provider, {
    value: mergedTheme
  }, /*#__PURE__*/React__default['default'].createElement(context$7.MediaQueryContext.Provider, {
    value: mergedMediaQuery
  }, /*#__PURE__*/React__default['default'].createElement(PortalsManager.PortalsManager, null, /*#__PURE__*/React__default['default'].createElement(FocusManager.FocusManager, null, /*#__PURE__*/React__default['default'].createElement(context$8.FrameContext.Provider, {
    value: mergedFrame
  }, children))))))))))));
}

function noop() {}

function createFrameContext({
  showToast = noop,
  hideToast = noop,
  setContextualSaveBar = noop,
  removeContextualSaveBar = noop,
  startLoading = noop,
  stopLoading = noop
} = {}) {
  return {
    showToast,
    hideToast,
    setContextualSaveBar,
    removeContextualSaveBar,
    startLoading,
    stopLoading
  };
}

exports.PolarisTestProvider = PolarisTestProvider;
