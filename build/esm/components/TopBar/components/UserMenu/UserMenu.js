import React from 'react';
import styles from './UserMenu.scss.js';
import { MessageIndicator } from '../../../MessageIndicator/MessageIndicator.js';
import { Menu } from '../Menu/Menu.js';
import { Avatar } from '../../../Avatar/Avatar.js';

function UserMenu({
  name,
  detail,
  avatar,
  initials,
  actions,
  message,
  onToggle,
  open,
  colorScheme,
  accessibilityLabel
}) {
  const showIndicator = Boolean(message);
  const activatorContentMarkup = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MessageIndicator, {
    active: showIndicator
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: "small",
    source: avatar,
    initials: initials && initials.replace(' ', '')
  })), /*#__PURE__*/React.createElement("span", {
    className: styles.Details
  }, /*#__PURE__*/React.createElement("p", {
    className: styles.Name
  }, name), /*#__PURE__*/React.createElement("p", {
    className: styles.Detail
  }, detail)));
  return /*#__PURE__*/React.createElement(Menu, {
    activatorContent: activatorContentMarkup,
    open: open,
    onOpen: onToggle,
    onClose: onToggle,
    actions: actions,
    message: message,
    colorScheme: colorScheme,
    accessibilityLabel: accessibilityLabel
  });
}

export { UserMenu };
