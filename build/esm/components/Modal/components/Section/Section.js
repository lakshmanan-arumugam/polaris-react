import React from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from './Section.scss.js';

function Section({
  children,
  flush = false,
  subdued = false
}) {
  const className = classNames(styles.Section, flush && styles.flush, subdued && styles.subdued);
  return /*#__PURE__*/React.createElement("section", {
    className: className
  }, children);
}

export { Section };
