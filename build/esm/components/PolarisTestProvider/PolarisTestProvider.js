import React, { useMemo, StrictMode, Fragment } from 'react';
import { merge } from '../../utilities/merge.js';
import { buildCustomProperties, buildThemeContext } from '../../utilities/theme/utils.js';
import { I18n } from '../../utilities/i18n/I18n.js';
import { ScrollLockManager } from '../../utilities/scroll-lock-manager/scroll-lock-manager.js';
import { StickyManager } from '../../utilities/sticky-manager/sticky-manager.js';
import { UniqueIdFactory, globalIdGeneratorFactory } from '../../utilities/unique-id/unique-id-factory.js';
import { FeaturesContext } from '../../utilities/features/context.js';
import { I18nContext } from '../../utilities/i18n/context.js';
import { ScrollLockManagerContext } from '../../utilities/scroll-lock-manager/context.js';
import { StickyManagerContext } from '../../utilities/sticky-manager/context.js';
import { UniqueIdFactoryContext } from '../../utilities/unique-id/context.js';
import { LinkContext } from '../../utilities/link/context.js';
import { ThemeContext } from '../../utilities/theme/context.js';
import { MediaQueryContext } from '../../utilities/media-query/context.js';
import { PortalsManager } from '../PortalsManager/PortalsManager.js';
import { FocusManager } from '../FocusManager/FocusManager.js';
import { FrameContext } from '../../utilities/frame/context.js';

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
  const Wrapper = strict ? StrictMode : Fragment;
  const intl = useMemo(() => new I18n(i18n || {}), [i18n]);
  const scrollLockManager = useMemo(() => new ScrollLockManager(), []);
  const stickyManager = useMemo(() => new StickyManager(), []);
  const uniqueIdFactory = useMemo(() => new UniqueIdFactory(globalIdGeneratorFactory), []);
  const processedThemeConfig = { ...theme,
    colorScheme: 'light'
  };
  const customProperties = buildCustomProperties(processedThemeConfig);
  const mergedTheme = buildThemeContext(processedThemeConfig, customProperties);
  const mergedFrame = createFrameContext(frame);
  const mergedMediaQuery = merge(defaultMediaQuery, mediaQuery);
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(FeaturesContext.Provider, {
    value: features
  }, /*#__PURE__*/React.createElement(I18nContext.Provider, {
    value: intl
  }, /*#__PURE__*/React.createElement(ScrollLockManagerContext.Provider, {
    value: scrollLockManager
  }, /*#__PURE__*/React.createElement(StickyManagerContext.Provider, {
    value: stickyManager
  }, /*#__PURE__*/React.createElement(UniqueIdFactoryContext.Provider, {
    value: uniqueIdFactory
  }, /*#__PURE__*/React.createElement(LinkContext.Provider, {
    value: link
  }, /*#__PURE__*/React.createElement(ThemeContext.Provider, {
    value: mergedTheme
  }, /*#__PURE__*/React.createElement(MediaQueryContext.Provider, {
    value: mergedMediaQuery
  }, /*#__PURE__*/React.createElement(PortalsManager, null, /*#__PURE__*/React.createElement(FocusManager, null, /*#__PURE__*/React.createElement(FrameContext.Provider, {
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

export { PolarisTestProvider };
