'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var focus = require('../../../../utilities/focus.js');
var Tabs = require('../../Tabs.scss.js');
var UnstyledLink = require('../../../UnstyledLink/UnstyledLink.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const wasSelected = React.useRef(selected);
  const panelFocused = React.useRef(false);
  const node = React.useRef(null); // A tab can start selected when it is moved from the disclosure dropdown
  // into the main list, so we need to send focus from the tab to the panel
  // on mount and update

  React.useEffect(() => {
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
      focus.focusFirstFocusableNode(node.current);
    }

    wasSelected.current = selected;
  }, [focused, id, measuring, panelID, selected]);
  const handleClick = onClick && onClick.bind(null, id);
  const className = css.classNames(Tabs['default'].Tab, selected && Tabs['default']['Tab-selected']);
  let tabIndex;

  if (selected && !siblingTabHasFocus && !measuring) {
    tabIndex = 0;
  } else if (focused && !measuring) {
    tabIndex = 0;
  } else {
    tabIndex = -1;
  }

  const tabContainerClassNames = css.classNames(Tabs['default'].TabContainer, selected && Tabs['default'].Underline);
  const markup = url ? /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
    id: id,
    url: url,
    role: "tab",
    tabIndex: tabIndex,
    onClick: handleClick,
    className: className,
    "aria-selected": selected,
    "aria-controls": panelID,
    "aria-label": accessibilityLabel,
    onMouseUp: focus.handleMouseUpByBlurring
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Tabs['default'].Title
  }, children)) : /*#__PURE__*/React__default['default'].createElement("button", {
    id: id,
    role: "tab",
    type: "button",
    tabIndex: tabIndex,
    className: className,
    onClick: handleClick,
    "aria-selected": selected,
    "aria-controls": panelID,
    "aria-label": accessibilityLabel,
    onMouseUp: focus.handleMouseUpByBlurring
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Tabs['default'].Title
  }, children));
  return /*#__PURE__*/React__default['default'].createElement("li", {
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

exports.Tab = Tab;
