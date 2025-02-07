import React, { useRef, useEffect } from 'react';
import { classNames } from '../../../../utilities/css.js';
import { focusFirstFocusableNode, handleMouseUpByBlurring } from '../../../../utilities/focus.js';
import styles from '../../Tabs.scss.js';
import { UnstyledLink } from '../../../UnstyledLink/UnstyledLink.js';

function Tab({
  id,
  focused,
  siblingTabHasFocus,
  children,
  onClick,
  selected,
  url,
  panelID,
  measuring,
  accessibilityLabel
}) {
  const wasSelected = useRef(selected);
  const panelFocused = useRef(false);
  const node = useRef(null); // A tab can start selected when it is moved from the disclosure dropdown
  // into the main list, so we need to send focus from the tab to the panel
  // on mount and update

  useEffect(() => {
    if (measuring) {
      return;
    } // Because of timing issues with the render, we may still have the old,
    // in-disclosure version of the tab that has focus. Check for this
    // as a second indicator of focus


    const itemHadFocus = focused || document.activeElement && document.activeElement.id === id; // If we just check for selected, the panel for the active tab will
    // be focused on page load, which we don’t want

    if (itemHadFocus && selected && panelID != null && !panelFocused.current) {
      focusPanelID(panelID);
      panelFocused.current = true;
    }

    if (selected && !wasSelected.current && panelID != null) {
      focusPanelID(panelID);
    } else if (focused && node.current != null) {
      focusFirstFocusableNode(node.current);
    }

    wasSelected.current = selected;
  }, [focused, id, measuring, panelID, selected]);
  const handleClick = onClick && onClick.bind(null, id);
  const className = classNames(styles.Tab, selected && styles['Tab-selected']);
  let tabIndex;

  if (selected && !siblingTabHasFocus && !measuring) {
    tabIndex = 0;
  } else if (focused && !measuring) {
    tabIndex = 0;
  } else {
    tabIndex = -1;
  }

  const tabContainerClassNames = classNames(styles.TabContainer, selected && styles.Underline);
  const markup = url ? /*#__PURE__*/React.createElement(UnstyledLink, {
    id: id,
    url: url,
    role: "tab",
    tabIndex: tabIndex,
    onClick: handleClick,
    className: className,
    "aria-selected": selected,
    "aria-controls": panelID,
    "aria-label": accessibilityLabel,
    onMouseUp: handleMouseUpByBlurring
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Title
  }, children)) : /*#__PURE__*/React.createElement("button", {
    id: id,
    role: "tab",
    type: "button",
    tabIndex: tabIndex,
    className: className,
    onClick: handleClick,
    "aria-selected": selected,
    "aria-controls": panelID,
    "aria-label": accessibilityLabel,
    onMouseUp: handleMouseUpByBlurring
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Title
  }, children));
  return /*#__PURE__*/React.createElement("li", {
    className: tabContainerClassNames,
    ref: node,
    role: "presentation"
  }, markup);
}

function focusPanelID(panelID) {
  const panel = document.getElementById(panelID);

  if (panel) {
    panel.focus({
      preventScroll: true
    });
  }
}

export { Tab };
