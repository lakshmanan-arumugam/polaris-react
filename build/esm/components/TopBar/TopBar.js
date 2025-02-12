import React from 'react';
import { MobileHamburgerMajor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css.js';
import { getWidth } from '../../utilities/get-width.js';
import { useToggle } from '../../utilities/use-toggle.js';
import styles from './TopBar.scss.js';
import { Search } from './components/Search/Search.js';
import { SearchField } from './components/SearchField/SearchField.js';
import { UserMenu } from './components/UserMenu/UserMenu.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { useTheme } from '../../utilities/theme/hooks.js';
import { Icon } from '../Icon/Icon.js';
import { UnstyledLink } from '../UnstyledLink/UnstyledLink.js';
import { Image } from '../Image/Image.js';
import { Menu } from './components/Menu/Menu.js';

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
  const i18n = useI18n();
  const {
    logo
  } = useTheme();
  const {
    value: focused,
    setTrue: forceTrueFocused,
    setFalse: forceFalseFocused
  } = useToggle(false);
  const iconClassName = classNames(styles.NavigationIcon, focused && styles.focused);
  const navigationButtonMarkup = showNavigationToggle ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: iconClassName,
    onClick: onNavigationToggle,
    onFocus: forceTrueFocused,
    onBlur: forceFalseFocused,
    "aria-label": i18n.translate('Polaris.TopBar.toggleMenuLabel')
  }, /*#__PURE__*/React.createElement(Icon, {
    source: MobileHamburgerMajor
  })) : null;
  const width = getWidth(logo, 104);
  let contextMarkup;

  if (contextControl) {
    contextMarkup = /*#__PURE__*/React.createElement("div", {
      className: styles.ContextControl
    }, contextControl);
  } else if (logo) {
    const className = classNames(styles.LogoContainer, showNavigationToggle || searchField ? styles.LogoDisplayControl : styles.LogoDisplayContainer);
    contextMarkup = /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement(UnstyledLink, {
      url: logo.url || '',
      className: styles.LogoLink,
      style: {
        width
      }
    }, /*#__PURE__*/React.createElement(Image, {
      source: logo.topBarSource || '',
      alt: logo.accessibilityLabel || '',
      className: styles.Logo,
      style: {
        width
      }
    })));
  }

  const searchMarkup = searchField ? /*#__PURE__*/React.createElement(React.Fragment, null, searchField, /*#__PURE__*/React.createElement(Search, {
    visible: searchResultsVisible,
    onDismiss: onSearchResultsDismiss,
    overlayVisible: searchResultsOverlayVisible
  }, searchResults)) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: styles.TopBar
  }, navigationButtonMarkup, contextMarkup, /*#__PURE__*/React.createElement("div", {
    className: styles.Contents
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.SearchField
  }, searchMarkup), /*#__PURE__*/React.createElement("div", {
    className: styles.SecondaryMenu
  }, secondaryMenu), userMenu));
};
TopBar.Menu = Menu;
TopBar.SearchField = SearchField;
TopBar.UserMenu = UserMenu;

export { TopBar };
