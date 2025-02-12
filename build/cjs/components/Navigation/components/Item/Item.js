'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../../../utilities/css.js');
var context = require('../../context.js');
var types = require('../../../../types.js');
var Navigation = require('../../Navigation.scss.js');
var Secondary = require('./components/Secondary/Secondary.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var hooks$1 = require('../../../../utilities/media-query/hooks.js');
var hooks$2 = require('../../../../utilities/unique-id/hooks.js');
var Indicator = require('../../../Indicator/Indicator.js');
var Icon = require('../../../Icon/Icon.js');
var Badge = require('../../../Badge/Badge.js');
var UnstyledLink = require('../../../UnstyledLink/UnstyledLink.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var MatchState;

(function (MatchState) {
  MatchState[MatchState["MatchForced"] = 0] = "MatchForced";
  MatchState[MatchState["MatchUrl"] = 1] = "MatchUrl";
  MatchState[MatchState["MatchPaths"] = 2] = "MatchPaths";
  MatchState[MatchState["Excluded"] = 3] = "Excluded";
  MatchState[MatchState["NoMatch"] = 4] = "NoMatch";
})(MatchState || (MatchState = {}));

function Item({
  url,
  icon,
  label,
  subNavigationItems = [],
  secondaryAction,
  disabled,
  onClick,
  accessibilityLabel,
  selected: selectedOverride,
  badge,
  new: isNew,
  matches,
  exactMatch,
  matchPaths,
  excludePaths,
  external
}) {
  const i18n = hooks.useI18n();
  const {
    isNavigationCollapsed
  } = hooks$1.useMediaQuery();
  const secondaryNavigationId = hooks$2.useUniqueId('SecondaryNavigation');
  const {
    location,
    onNavigationDismiss
  } = React.useContext(context.NavigationContext);
  const [expanded, setExpanded] = React.useState(false);
  const [keyFocused, setKeyFocused] = React.useState(false);
  React.useEffect(() => {
    if (!isNavigationCollapsed && expanded) {
      setExpanded(false);
    }
  }, [expanded, isNavigationCollapsed]);
  const handleKeyUp = React.useCallback(event => {
    if (event.keyCode === types.Key.Tab) {
      !keyFocused && setKeyFocused(true);
    }
  }, [keyFocused]);
  const handleBlur = React.useCallback(() => {
    keyFocused && setKeyFocused(false);
  }, [keyFocused]);
  const tabIndex = disabled ? -1 : 0;
  const hasNewChild = subNavigationItems.filter(subNavigationItem => subNavigationItem.new).length > 0;
  const indicatorMarkup = hasNewChild ? /*#__PURE__*/React__default['default'].createElement("span", {
    className: Navigation['default'].Indicator
  }, /*#__PURE__*/React__default['default'].createElement(Indicator.Indicator, {
    pulse: true
  })) : null;
  const iconMarkup = icon ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation['default'].Icon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: icon
  })) : null;
  const externalIconLabel = i18n.translate('Polaris.Common.newWindowAccessibilityHint');
  const externalLinkIconMarkup = external ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation['default'].ExternalIcon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    accessibilityLabel: externalIconLabel,
    source: polarisIcons.ExternalMinor,
    color: "base"
  })) : null;
  let badgeMarkup = null;

  if (isNew) {
    badgeMarkup = /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
      status: "new",
      size: "small"
    }, i18n.translate('Polaris.Badge.STATUS_LABELS.new'));
  } else if (typeof badge === 'string') {
    badgeMarkup = /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
      status: "new",
      size: "small"
    }, badge);
  } else {
    badgeMarkup = badge;
  }

  const wrappedBadgeMarkup = badgeMarkup == null ? null : /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation['default'].Badge
  }, badgeMarkup);
  const itemContentMarkup = /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, iconMarkup, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Navigation['default'].Text
  }, label, indicatorMarkup), wrappedBadgeMarkup);

  if (url == null) {
    const className = css.classNames(Navigation['default'].Item, disabled && Navigation['default']['Item-disabled'], keyFocused && Navigation['default'].keyFocused, selectedOverride && Navigation['default']['Item-selected']);
    return /*#__PURE__*/React__default['default'].createElement("li", {
      className: Navigation['default'].ListItem
    }, /*#__PURE__*/React__default['default'].createElement("button", {
      type: "button",
      className: className,
      disabled: disabled,
      "aria-disabled": disabled,
      "aria-label": accessibilityLabel,
      onClick: getClickHandler(onClick),
      onKeyUp: handleKeyUp,
      onBlur: handleBlur
    }, itemContentMarkup));
  }

  const secondaryActionMarkup = secondaryAction && /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
    external: true,
    url: secondaryAction.url,
    className: Navigation['default'].SecondaryAction,
    tabIndex: tabIndex,
    "aria-disabled": disabled,
    "aria-label": secondaryAction.accessibilityLabel,
    onClick: secondaryAction.onClick
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: secondaryAction.icon
  }));
  const matchState = matchStateForItem({
    url,
    matches,
    exactMatch,
    matchPaths,
    excludePaths
  }, location);
  const matchingSubNavigationItems = subNavigationItems.filter(item => {
    const subMatchState = matchStateForItem(item, location);
    return subMatchState === MatchState.MatchForced || subMatchState === MatchState.MatchUrl || subMatchState === MatchState.MatchPaths;
  });
  const childIsActive = matchingSubNavigationItems.length > 0;
  const selected = selectedOverride == null ? matchState === MatchState.MatchForced || matchState === MatchState.MatchUrl || matchState === MatchState.MatchPaths : selectedOverride;
  const showExpanded = selected || expanded || childIsActive;
  const itemClassName = css.classNames(Navigation['default'].Item, disabled && Navigation['default']['Item-disabled'], selected && subNavigationItems.length === 0 && Navigation['default']['Item-selected'], showExpanded && Navigation['default'].subNavigationActive, keyFocused && Navigation['default'].keyFocused);
  let secondaryNavigationMarkup = null;

  if (subNavigationItems.length > 0) {
    const longestMatch = matchingSubNavigationItems.sort(({
      url: firstUrl
    }, {
      url: secondUrl
    }) => secondUrl.length - firstUrl.length)[0];
    const SecondaryNavigationClassName = css.classNames(Navigation['default'].SecondaryNavigation, showExpanded && Navigation['default'].isExpanded, !icon && Navigation['default']['SecondaryNavigation-noIcon']);
    secondaryNavigationMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: SecondaryNavigationClassName
    }, /*#__PURE__*/React__default['default'].createElement(Secondary.Secondary, {
      expanded: showExpanded,
      id: secondaryNavigationId
    }, subNavigationItems.map(item => {
      const {
        label,
        ...rest
      } = item;

      const onClick = () => {
        if (onNavigationDismiss) {
          onNavigationDismiss();
        }

        if (item.onClick && item.onClick !== onNavigationDismiss) {
          item.onClick();
        }
      };

      return /*#__PURE__*/React__default['default'].createElement(Item, Object.assign({
        key: label
      }, rest, {
        label: label,
        matches: item === longestMatch,
        onClick: onClick
      }));
    })));
  }

  const className = css.classNames(Navigation['default'].ListItem, secondaryAction && Navigation['default']['ListItem-hasAction']);
  return /*#__PURE__*/React__default['default'].createElement("li", {
    className: className
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Navigation['default'].ItemWrapper
  }, /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, Object.assign({
    url: url,
    className: itemClassName,
    external: external,
    tabIndex: tabIndex,
    "aria-disabled": disabled,
    "aria-label": accessibilityLabel,
    onClick: getClickHandler(onClick),
    onKeyUp: handleKeyUp,
    onBlur: handleBlur
  }, normalizeAriaAttributes(secondaryNavigationId, subNavigationItems.length > 0, showExpanded)), itemContentMarkup, externalLinkIconMarkup), secondaryActionMarkup), secondaryNavigationMarkup);

  function getClickHandler(onClick) {
    return event => {
      const {
        currentTarget
      } = event;

      if (currentTarget.getAttribute('href') === location) {
        event.preventDefault();
      }

      if (subNavigationItems && subNavigationItems.length > 0 && isNavigationCollapsed) {
        event.preventDefault();
        setExpanded(!expanded);
      } else if (onNavigationDismiss) {
        onNavigationDismiss();

        if (onClick && onClick !== onNavigationDismiss) {
          onClick();
        }

        return;
      }

      if (onClick) {
        onClick();
      }
    };
  }
}
function isNavigationItemActive(navigationItem, currentPath) {
  const matchState = matchStateForItem(navigationItem, currentPath);
  const matchingSubNavigationItems = navigationItem.subNavigationItems && navigationItem.subNavigationItems.filter(item => {
    const subMatchState = matchStateForItem(item, currentPath);
    return subMatchState === MatchState.MatchForced || subMatchState === MatchState.MatchUrl || subMatchState === MatchState.MatchPaths;
  });
  const childIsActive = matchingSubNavigationItems && matchingSubNavigationItems.length > 0;
  const selected = matchState === MatchState.MatchForced || matchState === MatchState.MatchUrl || matchState === MatchState.MatchPaths;
  return selected || childIsActive;
}

function normalizePathname(pathname) {
  const barePathname = pathname.split('?')[0].split('#')[0];
  return barePathname.endsWith('/') ? barePathname : `${barePathname}/`;
}

function safeEqual(location, path) {
  return normalizePathname(location) === normalizePathname(path);
}

function safeStartsWith(location, path) {
  return normalizePathname(location).startsWith(normalizePathname(path));
}

function matchStateForItem({
  url,
  matches,
  exactMatch,
  matchPaths,
  excludePaths
}, location) {
  if (url == null) {
    return MatchState.NoMatch;
  }

  if (matches) {
    return MatchState.MatchForced;
  }

  if (matches === false || excludePaths && excludePaths.some(path => safeStartsWith(location, path))) {
    return MatchState.Excluded;
  }

  if (matchPaths && matchPaths.some(path => safeStartsWith(location, path))) {
    return MatchState.MatchPaths;
  }

  const matchesUrl = exactMatch ? safeEqual(location, url) : safeStartsWith(location, url);
  return matchesUrl ? MatchState.MatchUrl : MatchState.NoMatch;
}

function normalizeAriaAttributes(controlId, hasSubMenu, expanded) {
  return hasSubMenu ? {
    'aria-expanded': expanded,
    'aria-controls': controlId
  } : undefined;
}

exports.Item = Item;
exports.isNavigationItemActive = isNavigationItemActive;
