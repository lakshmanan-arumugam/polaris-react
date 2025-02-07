import React, { useState, useEffect } from 'react';
import { useIsMountedRef } from '../../../../utilities/use-is-mounted-ref.js';
import styles from './Loading.scss.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';

const STUCK_THRESHOLD = 99;
function Loading() {
  const i18n = useI18n();
  const isMountedRef = useIsMountedRef();
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (progress >= STUCK_THRESHOLD || animating) {
      return;
    }

    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      const step = Math.max((STUCK_THRESHOLD - progress) / 10, 1);
      setAnimating(true);
      setProgress(progress + step);
    });
  }, [progress, animating, isMountedRef]);
  const customStyles = {
    transform: `scaleX(${Math.floor(progress) / 100})`
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.Loading,
    "aria-valuenow": progress,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    role: "progressbar",
    "aria-label": i18n.translate('Polaris.Loading.label')
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Level,
    style: customStyles,
    onTransitionEnd: () => setAnimating(false)
  }));
}

export { Loading };
