import React, { useState, useRef, useEffect, useCallback } from 'react';
import { findFirstFocusableNode } from '../../utilities/focus.js';
import { useToggle } from '../../utilities/use-toggle.js';
import { Key } from '../../types.js';
import { TooltipOverlay } from './components/TooltipOverlay/TooltipOverlay.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { Portal } from '../Portal/Portal.js';

function Tooltip({
  children,
  content,
  dismissOnMouseOut,
  active: originalActive,
  preferredPosition = 'below',
  activatorWrapper = 'span',
  accessibilityLabel
}) {
  const WrapperComponent = activatorWrapper;
  const {
    value: active,
    setTrue: handleFocus,
    setFalse: handleBlur
  } = useToggle(Boolean(originalActive));
  const [activatorNode, setActivatorNode] = useState(null);
  const id = useUniqueId('TooltipContent');
  const activatorContainer = useRef(null);
  const mouseEntered = useRef(false);
  useEffect(() => {
    const firstFocusable = activatorContainer.current ? findFirstFocusableNode(activatorContainer.current) : null;
    const accessibilityNode = firstFocusable || activatorContainer.current;
    if (!accessibilityNode) return;
    accessibilityNode.tabIndex = 0;
    accessibilityNode.setAttribute('aria-describedby', id);
    accessibilityNode.setAttribute('data-polaris-tooltip-activator', 'true');
  }, [id, children]);
  const handleKeyUp = useCallback(event => {
    if (event.keyCode !== Key.Escape) return;
    handleBlur();
  }, [handleBlur]);
  const portal = activatorNode ? /*#__PURE__*/React.createElement(Portal, {
    idPrefix: "tooltip"
  }, /*#__PURE__*/React.createElement(TooltipOverlay, {
    id: id,
    preferredPosition: preferredPosition,
    activator: activatorNode,
    active: active,
    accessibilityLabel: accessibilityLabel,
    onClose: noop,
    preventInteraction: dismissOnMouseOut
  }, content)) : null;
  return /*#__PURE__*/React.createElement(WrapperComponent, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseLeave: handleMouseLeave,
    onMouseOver: handleMouseEnterFix,
    onClick: stopPropagation,
    ref: setActivator,
    onKeyUp: handleKeyUp
  }, children, portal);

  function setActivator(node) {
    const activatorContainerRef = activatorContainer;

    if (node == null) {
      activatorContainerRef.current = null;
      setActivatorNode(null);
      return;
    }

    node.firstElementChild instanceof HTMLElement && setActivatorNode(node.firstElementChild);
    activatorContainerRef.current = node;
  }

  function handleMouseEnter() {
    mouseEntered.current = true;
    handleFocus();
  }

  function handleMouseLeave() {
    mouseEntered.current = false;
    handleBlur();
  } // https://github.com/facebook/react/issues/10109
  // Mouseenter event not triggered when cursor moves from disabled button


  function handleMouseEnterFix() {
    !mouseEntered.current && handleMouseEnter();
  }
}

function noop() {}

function stopPropagation(event) {
  event.stopPropagation();
}

export { Tooltip };
