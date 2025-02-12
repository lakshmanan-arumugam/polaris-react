import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ExternalMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { NavigationContext } from '../../context.js';
import { Key } from '../../../../types.js';
import styles from '../../Navigation.scss.js';
import { Secondary } from './components/Secondary/Secondary.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { useMediaQuery } from '../../../../utilities/media-query/hooks.js';
import { useUniqueId } from '../../../../utilities/unique-id/hooks.js';
import { Indicator } from '../../../Indicator/Indicator.js';
import { Icon } from '../../../Icon/Icon.js';
import { Badge } from '../../../Badge/Badge.js';
import { UnstyledLink } from '../../../UnstyledLink/UnstyledLink.js';

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
  const i18n = useI18n();
  const {
    isNavigationCollapsed
  } = useMediaQuery();
  const secondaryNavigationId = useUniqueId('SecondaryNavigation');
  const {
    location,
    onNavigationDismiss
  } = useContext(NavigationContext);
  const [expanded, setExpanded] = useState(false);
  const [keyFocused, setKeyFocused] = useState(false);
  useEffect(() => {
    if (!isNavigationCollapsed && expanded) {
      setExpanded(false);
    }
  }, [expanded, isNavigationCollapsed]);
  const handleKeyUp = useCallback(event => {
    if (event.keyCode === Key.Tab) {
      !keyFocused && setKeyFocused(true);
    }
  }, [keyFocused]);
  const handleBlur = useCallback(() => {
    keyFocused && setKeyFocused(false);
  }, [keyFocused]);
  const tabIndex = disabled ? -1 : 0;
  const hasNewChild = subNavigationItems.filter(subNavigationItem => subNavigationItem.new).length > 0;
  const indicatorMarkup = hasNewChild ? /*#__PURE__*/React.createElement("span", {
    className: styles.Indicator
  }, /*#__PURE__*/React.createElement(Indicator, {
    pulse: true
  })) : null;
  const iconMarkup = icon ? /*#__PURE__*/React.createElement("div", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: icon
  })) : null;
  const externalIconLabel = i18n.translate('Polaris.Common.newWindowAccessibilityHint');
  const externalLinkIconMarkup = external ? /*#__PURE__*/React.createElement("div", {
    className: styles.ExternalIcon
  }, /*#__PURE__*/React.createElement(Icon, {
    accessibilityLabel: externalIconLabel,
    source: ExternalMinor,
    color: "base"
  })) : null;
  let badgeMarkup = null;

  if (isNew) {
    badgeMarkup = /*#__PURE__*/React.createElement(Badge, {
      status: "new",
      size: "small"
    }, i18n.translate('Polaris.Badge.STATUS_LABELS.new'));
  } else if (typeof badge === 'string') {
    badgeMarkup = /*#__PURE__*/React.createElement(Badge, {
      status: "new",
      size: "small"
    }, badge);
  } else {
    badgeMarkup = badge;
  }

  const wrappedBadgeMarkup = badgeMarkup == null ? null : /*#__PURE__*/React.createElement("div", {
    className: styles.Badge
  }, badgeMarkup);
  const itemContentMarkup = /*#__PURE__*/React.createElement(React.Fragment, null, iconMarkup, /*#__PURE__*/React.createElement("span", {
    className: styles.Text
  }, label, indicatorMarkup), wrappedBadgeMarkup);

  if (url == null) {
    const className = classNames(styles.Item, disabled && styles['Item-disabled'], keyFocused && styles.keyFocused, selectedOverride && styles['Item-selected']);
    return /*#__PURE__*/React.createElement("li", {
      className: styles.ListItem
    }, /*#__PURE__*/React.createElement("button", {
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

  const secondaryActionMarkup = secondaryAction && /*#__PURE__*/React.createElement(UnstyledLink, {
    external: true,
    url: secondaryAction.url,
    className: styles.SecondaryAction,
    tabIndex: tabIndex,
    "aria-disabled": disabled,
    "aria-label": secondaryAction.accessibilityLabel,
    onClick: secondaryAction.onClick
  }, /*#__PURE__*/React.createElement(Icon, {
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
  const itemClassName = classNames(styles.Item, disabled && styles['Item-disabled'], selected && subNavigationItems.length === 0 && styles['Item-selected'], showExpanded && styles.subNavigationActive, keyFocused && styles.keyFocused);
  let secondaryNavigationMarkup = null;

  if (subNavigationItems.length > 0) {
    const longestMatch = matchingSubNavigationItems.sort(({
      url: firstUrl
    }, {
      url: secondUrl
    }) => secondUrl.length - firstUrl.length)[0];
    const SecondaryNavigationClassName = classNames(styles.SecondaryNavigation, showExpanded && styles.isExpanded, !icon && styles['SecondaryNavigation-noIcon']);
    secondaryNavigationMarkup = /*#__PURE__*/React.createElement("div", {
      className: SecondaryNavigationClassName
    }, /*#__PURE__*/React.createElement(Secondary, {
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

      return /*#__PURE__*/React.createElement(Item, Object.assign({
        key: label
      }, rest, {
        label: label,
        matches: item === longestMatch,
        onClick: onClick
      }));
    })));
  }

  const className = classNames(styles.ListItem, secondaryAction && styles['ListItem-hasAction']);
  return /*#__PURE__*/React.createElement("li", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.ItemWrapper
  }, /*#__PURE__*/React.createElement(UnstyledLink, Object.assign({
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

export { Item, isNavigationItemActive };
