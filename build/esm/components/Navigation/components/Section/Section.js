import React, { useRef, useEffect } from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { navigationBarCollapsed } from '../../../../utilities/breakpoints.js';
import { useToggle } from '../../../../utilities/use-toggle.js';
import styles from '../../Navigation.scss.js';
import { Item } from '../Item/Item.js';
import { Icon } from '../../../Icon/Icon.js';
import { useUniqueId } from '../../../../utilities/unique-id/hooks.js';
import { Collapsible } from '../../../Collapsible/Collapsible.js';

function Section({
  title,
  fill,
  action,
  items,
  rollup,
  separator
}) {
  const {
    value: expanded,
    toggle: toggleExpanded,
    setFalse: setExpandedFalse
  } = useToggle(false);
  const animationFrame = useRef(null);

  const handleClick = (onClick, hasSubNavItems) => {
    return () => {
      if (onClick) {
        onClick();
      }

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      if (!hasSubNavItems || !navigationBarCollapsed().matches) {
        animationFrame.current = requestAnimationFrame(setExpandedFalse);
      }
    };
  };

  useEffect(() => {
    return () => {
      animationFrame.current && cancelAnimationFrame(animationFrame.current);
    };
  });
  const className = classNames(styles.Section, separator && styles['Section-withSeparator'], fill && styles['Section-fill']);
  const actionMarkup = action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.Action,
    "aria-label": action.accessibilityLabel,
    onClick: action.onClick
  }, /*#__PURE__*/React.createElement(Icon, {
    source: action.icon
  }));
  const sectionHeadingMarkup = title && /*#__PURE__*/React.createElement("li", {
    className: styles.SectionHeading
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Text
  }, title), actionMarkup);
  const itemsMarkup = items.map(item => {
    const {
      onClick,
      label,
      subNavigationItems,
      ...rest
    } = item;
    const hasSubNavItems = subNavigationItems != null && subNavigationItems.length > 0;
    return /*#__PURE__*/React.createElement(Item, Object.assign({
      key: label
    }, rest, {
      label: label,
      subNavigationItems: subNavigationItems,
      onClick: handleClick(onClick, hasSubNavItems)
    }));
  });
  const toggleClassName = classNames(styles.Item, styles.RollupToggle);
  const ariaLabel = rollup && (expanded ? rollup.hide : rollup.view);
  const toggleRollup = rollup && items.length > rollup.after && /*#__PURE__*/React.createElement("div", {
    className: styles.ListItem,
    key: "List Item"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: toggleClassName,
    onClick: toggleExpanded,
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: HorizontalDotsMinor
  }))));
  const activeItemIndex = items.findIndex(item => {
    if (!rollup) {
      return false;
    }

    return rollup.activePath === item.url || item.url && rollup.activePath.startsWith(item.url) || (item.subNavigationItems ? item.subNavigationItems.some(({
      url: itemUrl
    }) => rollup.activePath.startsWith(itemUrl)) : false);
  });
  const sectionItems = rollup ? itemsMarkup.slice(0, rollup.after) : itemsMarkup;
  const additionalItems = rollup ? itemsMarkup.slice(rollup.after) : [];

  if (rollup && activeItemIndex !== -1 && activeItemIndex > rollup.after - 1) {
    sectionItems.push(...additionalItems.splice(activeItemIndex - rollup.after, 1));
  }

  const additionalItemsId = useUniqueId('AdditionalItems');
  const activeItemsMarkup = rollup && additionalItems.length > 0 && /*#__PURE__*/React.createElement("li", {
    className: styles.RollupSection
  }, /*#__PURE__*/React.createElement(Collapsible, {
    id: additionalItemsId,
    open: expanded
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.List
  }, additionalItems)), toggleRollup);
  return /*#__PURE__*/React.createElement("ul", {
    className: className
  }, sectionHeadingMarkup, sectionItems, activeItemsMarkup);
}

export { Section };
