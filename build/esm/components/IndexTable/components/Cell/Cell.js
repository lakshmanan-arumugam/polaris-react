import React, { memo } from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../IndexTable.scss.js';

const Cell = /*#__PURE__*/memo(function Cell({
  children,
  flush
}) {
  const cellClassName = classNames(styles.TableCell, flush && styles['TableCell-flush']);
  return /*#__PURE__*/React.createElement("td", {
    className: cellClassName
  }, children);
});

export { Cell };
