import React, { useRef, useCallback, useEffect } from 'react';
import { durationSlow } from '@shopify/polaris-tokens';
import { CSSTransition } from 'react-transition-group';
import { focusFirstFocusableNode } from '../../utilities/focus.js';
import { classNames } from '../../utilities/css.js';
import { Key } from '../../types.js';
import { layer, overlay } from '../shared.js';
import styles from './Sheet.scss.js';
import { useMediaQuery } from '../../utilities/media-query/hooks.js';
import { TrapFocus } from '../TrapFocus/TrapFocus.js';
import { Backdrop } from '../Backdrop/Backdrop.js';
import { Portal } from '../Portal/Portal.js';
import { KeypressListener } from '../KeypressListener/KeypressListener.js';

const BOTTOM_CLASS_NAMES = {
  enter: classNames(styles.Bottom, styles.enterBottom),
  enterActive: classNames(styles.Bottom, styles.enterBottomActive),
  exit: classNames(styles.Bottom, styles.exitBottom),
  exitActive: classNames(styles.Bottom, styles.exitBottomActive)
};
const RIGHT_CLASS_NAMES = {
  enter: classNames(styles.Right, styles.enterRight),
  enterActive: classNames(styles.Right, styles.enterRightActive),
  exit: classNames(styles.Right, styles.exitRight),
  exitActive: classNames(styles.Right, styles.exitRightActive)
};

/** @deprecated Use <Modal /> instead or avoid modal patterns all together. */
function Sheet({
  children,
  open,
  onClose,
  onEntered,
  onExit,
  accessibilityLabel,
  activator
}) {
  const {
    isNavigationCollapsed
  } = useMediaQuery();
  const container = useRef(null);
  const activatorRef = useRef(null);
  const handleClose = useCallback(() => {
    onClose();
    const activatorElement = activator && isRef(activator) ? activator && activator.current : activatorRef.current;

    if (activatorElement) {
      requestAnimationFrame(() => focusFirstFocusableNode(activatorElement));
    }
  }, [activator, onClose]);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Deprecation: <Sheet /> is deprecated. This component might be removed in a future major version of Polaris. Use <Modal /> instead or avoid modal patterns all together.');
    }
  }, []);
  const activatorMarkup = activator && !isRef(activator) ? /*#__PURE__*/React.createElement("div", {
    ref: activatorRef
  }, activator) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, activatorMarkup, /*#__PURE__*/React.createElement(Portal, {
    idPrefix: "sheet"
  }, /*#__PURE__*/React.createElement(CSSTransition, {
    nodeRef: container,
    classNames: isNavigationCollapsed ? BOTTOM_CLASS_NAMES : RIGHT_CLASS_NAMES,
    timeout: durationSlow,
    in: open,
    mountOnEnter: true,
    unmountOnExit: true,
    onEntered: onEntered,
    onExit: onExit
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    className: styles.Container
  }, layer.props, overlay.props, {
    ref: container
  }), /*#__PURE__*/React.createElement(TrapFocus, {
    trapping: open
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": true,
    tabIndex: -1,
    className: styles.Sheet,
    "aria-label": accessibilityLabel
  }, children)))), /*#__PURE__*/React.createElement(KeypressListener, {
    keyCode: Key.Escape,
    handler: handleClose
  }), open && /*#__PURE__*/React.createElement(Backdrop, {
    transparent: true,
    onClick: handleClose
  })));
}

function isRef(ref) {
  return Object.prototype.hasOwnProperty.call(ref, 'current');
}

export { Sheet };
