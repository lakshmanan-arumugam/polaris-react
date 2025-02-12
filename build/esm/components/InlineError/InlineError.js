import React from 'react';
import { AlertMinor } from '@shopify/polaris-icons';
import styles from './InlineError.scss.js';
import { Icon } from '../Icon/Icon.js';

function InlineError({
  message,
  fieldID
}) {
  if (!message) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    id: errorTextID(fieldID),
    className: styles.InlineError
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: AlertMinor
  })), message);
}
function errorTextID(id) {
  return `${id}Error`;
}

export { InlineError, errorTextID };
