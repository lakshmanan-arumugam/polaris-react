import React, { forwardRef, useState, useRef, useImperativeHandle, useCallback, useEffect, Children } from 'react';
import { findFirstFocusableNodeIncludingDisabled, focusNextFocusableNode } from '../../utilities/focus.js';
import { portal } from '../shared.js';
import { setActivatorAttributes } from './set-activator-attributes.js';
import { Portal } from '../Portal/Portal.js';
import { PopoverOverlay, PopoverCloseSource } from './components/PopoverOverlay/PopoverOverlay.js';
export { PopoverCloseSource } from './components/PopoverOverlay/PopoverOverlay.js';
import { Pane } from './components/Pane/Pane.js';
import { Section } from './components/Section/Section.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';

// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
const PopoverComponent = /*#__PURE__*/forwardRef(function Popover({
  activatorWrapper = 'div',
  children,
  onClose,
  activator,
  preventFocusOnClose,
  active,
  fixed,
  ariaHaspopup,
  preferInputActivator = true,
  colorScheme,
  zIndexOverride,
  ...rest
}, ref) {
  const [activatorNode, setActivatorNode] = useState();
  const overlayRef = useRef(null);
  const activatorContainer = useRef(null);
  const WrapperComponent = activatorWrapper;
  const id = useUniqueId('popover');

  function forceUpdatePosition() {
    var _overlayRef$current;

    (_overlayRef$current = overlayRef.current) === null || _overlayRef$current === void 0 ? void 0 : _overlayRef$current.forceUpdatePosition();
  }

  useImperativeHandle(ref, () => {
    return {
      forceUpdatePosition
    };
  });
  const setAccessibilityAttributes = useCallback(() => {
    if (activatorContainer.current == null) {
      return;
    }

    const firstFocusable = findFirstFocusableNodeIncludingDisabled(activatorContainer.current);
    const focusableActivator = firstFocusable || activatorContainer.current;
    const activatorDisabled = 'disabled' in focusableActivator && Boolean(focusableActivator.disabled);
    setActivatorAttributes(focusableActivator, {
      id,
      active,
      ariaHaspopup,
      activatorDisabled
    });
  }, [id, active, ariaHaspopup]);

  const handleClose = source => {
    onClose(source);

    if (activatorContainer.current == null || preventFocusOnClose) {
      return;
    }

    if ((source === PopoverCloseSource.FocusOut || source === PopoverCloseSource.EscapeKeypress) && activatorNode) {
      const focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode) || findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;

      if (!focusNextFocusableNode(focusableActivator, isInPortal)) {
        focusableActivator.focus();
      }
    }
  };

  useEffect(() => {
    if (!activatorNode && activatorContainer.current) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    } else if (activatorNode && activatorContainer.current && !activatorContainer.current.contains(activatorNode)) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    }

    setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]);
  useEffect(() => {
    if (activatorNode && activatorContainer.current) {
      setActivatorNode(activatorContainer.current.firstElementChild);
    }

    setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]);
  const portal = activatorNode ? /*#__PURE__*/React.createElement(Portal, {
    idPrefix: "popover"
  }, /*#__PURE__*/React.createElement(PopoverOverlay, Object.assign({
    ref: overlayRef,
    id: id,
    activator: activatorNode,
    preferInputActivator: preferInputActivator,
    onClose: handleClose,
    active: active,
    fixed: fixed,
    colorScheme: colorScheme,
    zIndexOverride: zIndexOverride
  }, rest), children)) : null;
  return /*#__PURE__*/React.createElement(WrapperComponent, {
    ref: activatorContainer
  }, Children.only(activator), portal);
});

function isInPortal(element) {
  let parentElement = element.parentElement;

  while (parentElement) {
    if (parentElement.matches(portal.selector)) return false;
    parentElement = parentElement.parentElement;
  }

  return true;
}

const Popover = Object.assign(PopoverComponent, {
  Pane,
  Section
});

export { Popover };
