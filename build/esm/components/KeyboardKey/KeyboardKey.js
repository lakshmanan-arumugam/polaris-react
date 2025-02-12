import React from 'react';
import styles from './KeyboardKey.scss.js';

function KeyboardKey({
  children
}) {
  let key = children || '';
  key = key.length > 1 ? key.toLowerCase() : key.toUpperCase();
  return /*#__PURE__*/React.createElement("kbd", {
    className: styles.KeyboardKey
  }, key);
}

export { KeyboardKey };
