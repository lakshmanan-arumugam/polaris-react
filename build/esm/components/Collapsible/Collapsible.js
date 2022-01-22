import React, { useState, useRef, useCallback, useEffect } from 'react';
import { classNames } from '../../utilities/css.js';
import styles from './Collapsible.scss.js';

function Collapsible({
  id,
  expandOnPrint,
  open,
  transition,
  children
}) {
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(open);
  const [animationState, setAnimationState] = useState('idle');
  const collapsibleContainer = useRef(null);
  const isFullyOpen = animationState === 'idle' && open && isOpen;
  const isFullyClosed = animationState === 'idle' && !open && !isOpen;
  const content = expandOnPrint || !isFullyClosed ? children : null;
  const wrapperClassName = classNames(styles.Collapsible, isFullyClosed && styles.isFullyClosed, expandOnPrint && styles.expandOnPrint);
  const collapsibleStyles = { ...(transition && {
      transitionDuration: `${transition.duration}`,
      transitionTimingFunction: `${transition.timingFunction}`
    }),
    ...{
      maxHeight: isFullyOpen ? 'none' : `${height}px`,
      overflow: isFullyOpen ? 'visible' : 'hidden'
    }
  };
  const handleCompleteAnimation = useCallback(({
    target
  }) => {
    if (target === collapsibleContainer.current) {
      setAnimationState('idle');
      setIsOpen(open);
    }
  }, [open]);
  useEffect(() => {
    if (open !== isOpen) {
      setAnimationState('measuring');
    }
  }, [open, isOpen]);
  useEffect(() => {
    if (!open || !collapsibleContainer.current) return; // If collapsible defaults to open, set an initial height

    setHeight(collapsibleContainer.current.scrollHeight); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!collapsibleContainer.current) return;

    switch (animationState) {
      case 'idle':
        break;

      case 'measuring':
        setHeight(collapsibleContainer.current.scrollHeight);
        setAnimationState('animating');
        break;

      case 'animating':
        setHeight(open ? collapsibleContainer.current.scrollHeight : 0);
    }
  }, [animationState, open, isOpen]);
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: collapsibleStyles,
    ref: collapsibleContainer,
    className: wrapperClassName,
    onTransitionEnd: handleCompleteAnimation,
    "aria-expanded": open
  }, content);
}

export { Collapsible };
