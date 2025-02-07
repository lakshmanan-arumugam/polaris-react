import React, { memo, createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { classNames } from '../../../../utilities/css.js';
import { useDeepEffect } from '../../../../utilities/use-deep-effect.js';
import { useDeepCallback } from '../../../../utilities/use-deep-callback.js';
import styles from './ToastManager.scss.js';
import { Toast } from '../Toast/Toast.js';
import { Portal } from '../../../Portal/Portal.js';
import { EventListener } from '../../../EventListener/EventListener.js';

const ToastManager = /*#__PURE__*/memo(function ToastManager({
  toastMessages
}) {
  const toastNodes = [];
  const updateToasts = useDeepCallback(() => {
    let targetInPos = 0;
    toastMessages.forEach((_, index) => {
      const currentToast = toastNodes[index];
      if (!currentToast.current) return;
      targetInPos += currentToast.current.clientHeight;
      currentToast.current.style.setProperty('--toast-translate-y-in', `-${targetInPos}px`);
      currentToast.current.style.setProperty('--toast-translate-y-out', `${-targetInPos + 150}px`);
    });
  }, [toastMessages, toastNodes]);
  useDeepEffect(() => {
    updateToasts();
  }, [toastMessages]);
  const toastsMarkup = toastMessages.map((toast, index) => {
    const toastNode = /*#__PURE__*/createRef();
    toastNodes[index] = toastNode;
    return /*#__PURE__*/React.createElement(CSSTransition, {
      nodeRef: toastNodes[index],
      key: toast.id,
      timeout: {
        enter: 0,
        exit: 400
      },
      classNames: toastClasses
    }, /*#__PURE__*/React.createElement("div", {
      ref: toastNode
    }, /*#__PURE__*/React.createElement(Toast, toast)));
  });
  return /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(EventListener, {
    event: "resize",
    handler: updateToasts
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.ToastManager,
    "aria-live": "assertive"
  }, /*#__PURE__*/React.createElement(TransitionGroup, {
    component: null
  }, toastsMarkup)));
});
const toastClasses = {
  enter: classNames(styles.ToastWrapper, styles['ToastWrapper-enter']),
  enterDone: classNames(styles.ToastWrapper, styles['ToastWrapper-enter-done']),
  exit: classNames(styles.ToastWrapper, styles['ToastWrapper-exit'])
};

export { ToastManager };
