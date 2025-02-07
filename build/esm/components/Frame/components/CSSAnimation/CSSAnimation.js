import React, { useState, useRef, useEffect } from 'react';
import { classNames, variationName } from '../../../../utilities/css.js';
import styles from './CSSAnimation.scss.js';

var TransitionStatus;

(function (TransitionStatus) {
  TransitionStatus["Entering"] = "entering";
  TransitionStatus["Entered"] = "entered";
  TransitionStatus["Exiting"] = "exiting";
  TransitionStatus["Exited"] = "exited";
})(TransitionStatus || (TransitionStatus = {}));

function CSSAnimation({
  in: inProp,
  className,
  type,
  children
}) {
  const [transitionStatus, setTransitionStatus] = useState(inProp ? TransitionStatus.Entering : TransitionStatus.Exited);
  const isMounted = useRef(false);
  const node = useRef(null);
  useEffect(() => {
    if (!isMounted.current) return;
    transitionStatus === TransitionStatus.Entering && changeTransitionStatus(TransitionStatus.Entered);
  }, [transitionStatus]);
  useEffect(() => {
    if (!isMounted.current) return;
    inProp && changeTransitionStatus(TransitionStatus.Entering);
    !inProp && changeTransitionStatus(TransitionStatus.Exiting);
  }, [inProp]);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  const wrapperClassName = classNames(className, styles[variationName('start', type)], inProp && styles[variationName('end', type)]);
  const content = transitionStatus === TransitionStatus.Exited && !inProp ? null : children;
  return /*#__PURE__*/React.createElement("div", {
    className: wrapperClassName,
    ref: node,
    onTransitionEnd: handleTransitionEnd
  }, content);

  function handleTransitionEnd() {
    transitionStatus === TransitionStatus.Exiting && changeTransitionStatus(TransitionStatus.Exited);
  }

  function changeTransitionStatus(transitionStatus) {
    setTransitionStatus(transitionStatus); // Forcing a reflow to enable the animation

    if (transitionStatus === TransitionStatus.Entering) node.current && node.current.getBoundingClientRect();
  }
}

export { CSSAnimation };
