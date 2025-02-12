import React from 'react';
import styles from './Menu.scss.js';
import { Message } from './components/Message/Message.js';
import { Popover } from '../../../Popover/Popover.js';
import { ActionList } from '../../../ActionList/ActionList.js';

function Menu(props) {
  const {
    actions,
    onOpen,
    onClose,
    open,
    activatorContent,
    message,
    colorScheme,
    accessibilityLabel
  } = props;
  const badgeProps = message && message.badge && {
    content: message.badge.content,
    status: message.badge.status
  };
  const messageMarkup = message && /*#__PURE__*/React.createElement(Message, {
    title: message.title,
    description: message.description,
    action: {
      onClick: message.action.onClick,
      content: message.action.content
    },
    link: {
      to: message.link.to,
      content: message.link.content
    },
    badge: badgeProps
  });
  const isFullHeight = Boolean(message);
  return /*#__PURE__*/React.createElement(Popover, {
    activator: /*#__PURE__*/React.createElement("div", {
      className: styles.ActivatorWrapper
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: styles.Activator,
      onClick: onOpen,
      "aria-label": accessibilityLabel
    }, activatorContent)),
    active: open,
    onClose: onClose,
    fixed: true,
    fullHeight: isFullHeight,
    preferredAlignment: "right",
    colorScheme: colorScheme
  }, /*#__PURE__*/React.createElement(ActionList, {
    onActionAnyItem: onClose,
    sections: actions
  }), messageMarkup);
}

export { Menu };
