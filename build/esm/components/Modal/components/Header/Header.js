import React from 'react';
import styles from './Header.scss.js';
import { CloseButton } from '../CloseButton/CloseButton.js';
import { DisplayText } from '../../../DisplayText/DisplayText.js';

function Header({
  id,
  titleHidden,
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: titleHidden || !children ? styles.titleHidden : styles.Header
  }, /*#__PURE__*/React.createElement("div", {
    id: id,
    className: styles.Title
  }, /*#__PURE__*/React.createElement(DisplayText, {
    element: "h2",
    size: "small"
  }, children)), /*#__PURE__*/React.createElement(CloseButton, {
    onClick: onClose
  }));
}

export { Header };
