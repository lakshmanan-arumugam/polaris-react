import React, { useRef } from 'react';
import { wrapFocusPreviousFocusableMenuItem, wrapFocusNextFocusableMenuItem } from '../../utilities/focus.js';
import { Key } from '../../types.js';
import { classNames } from '../../utilities/css.js';
import styles from './ActionList.scss.js';
import { Section } from './components/Section/Section.js';
import { KeypressListener } from '../KeypressListener/KeypressListener.js';

function ActionList({
  items,
  sections = [],
  actionRole,
  onActionAnyItem
}) {
  let finalSections = [];
  const actionListRef = useRef(null);

  if (items) {
    finalSections = [{
      items
    }, ...sections];
  } else if (sections) {
    finalSections = sections;
  }

  const className = classNames(styles.ActionList);
  const hasMultipleSections = finalSections.length > 1;
  const Element = hasMultipleSections ? 'ul' : 'div';
  const elementRole = hasMultipleSections && actionRole === 'menuitem' ? 'menu' : undefined;
  const elementTabIndex = hasMultipleSections && actionRole === 'menuitem' ? -1 : undefined;
  const sectionMarkup = finalSections.map((section, index) => {
    return section.items.length > 0 ? /*#__PURE__*/React.createElement(Section, {
      key: section.title || index,
      firstSection: index === 0,
      section: section,
      hasMultipleSections: hasMultipleSections,
      actionRole: actionRole,
      onActionAnyItem: onActionAnyItem
    }) : null;
  });

  const handleFocusPreviousItem = evt => {
    evt.preventDefault();

    if (actionListRef.current && evt.target) {
      if (actionListRef.current.contains(evt.target)) {
        wrapFocusPreviousFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };

  const handleFocusNextItem = evt => {
    evt.preventDefault();

    if (actionListRef.current && evt.target) {
      if (actionListRef.current.contains(evt.target)) {
        wrapFocusNextFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };

  const listeners = actionRole === 'menuitem' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.DownArrow,
    handler: handleFocusNextItem
  }), /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.UpArrow,
    handler: handleFocusPreviousItem
  })) : null;
  return /*#__PURE__*/React.createElement(Element, {
    ref: actionListRef,
    className: className,
    role: elementRole,
    tabIndex: elementTabIndex
  }, listeners, sectionMarkup);
}

export { ActionList };
