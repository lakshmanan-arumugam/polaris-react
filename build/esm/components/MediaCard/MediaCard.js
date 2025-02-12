import React from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { useToggle } from '../../utilities/use-toggle.js';
import { classNames } from '../../utilities/css.js';
import styles from './MediaCard.scss.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Button } from '../Button/Button.js';
import { Popover } from '../Popover/Popover.js';
import { ActionList } from '../ActionList/ActionList.js';
import { buttonFrom } from '../Button/utils.js';
import { Card } from '../Card/Card.js';
import { Stack } from '../Stack/Stack.js';
import { Heading } from '../Heading/Heading.js';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.js';

function MediaCard({
  title,
  children,
  primaryAction,
  secondaryAction,
  description,
  popoverActions = [],
  portrait = false,
  size = 'medium'
}) {
  const i18n = useI18n();
  const {
    value: popoverActive,
    toggle: togglePopoverActive
  } = useToggle(false);
  let headerMarkup = null;

  if (title) {
    const headerContent = typeof title === 'string' ? /*#__PURE__*/React.createElement(Heading, null, title) : title;
    headerMarkup = /*#__PURE__*/React.createElement("div", {
      className: styles.Heading
    }, headerContent);
  }

  const popoverActivator = /*#__PURE__*/React.createElement(Button, {
    icon: HorizontalDotsMinor,
    onClick: togglePopoverActive,
    size: "slim",
    plain: true,
    accessibilityLabel: i18n.translate('Polaris.MediaCard.popoverButton')
  });
  const popoverActionsMarkup = popoverActions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: styles.Popover
  }, /*#__PURE__*/React.createElement(Popover, {
    active: popoverActive,
    activator: popoverActivator,
    onClose: togglePopoverActive,
    preferredAlignment: "left",
    preferredPosition: "below"
  }, /*#__PURE__*/React.createElement(ActionList, {
    items: popoverActions,
    onActionAnyItem: togglePopoverActive
  }))) : null;
  const primaryActionMarkup = primaryAction ? /*#__PURE__*/React.createElement("div", {
    className: styles.PrimaryAction
  }, buttonFrom(primaryAction)) : null;
  const secondaryActionMarkup = secondaryAction ? /*#__PURE__*/React.createElement("div", {
    className: styles.SecondaryAction
  }, buttonFrom(secondaryAction, {
    plain: true
  })) : null;
  const actionClassName = classNames(styles.ActionContainer, portrait && styles.portrait);
  const actionMarkup = primaryActionMarkup || secondaryActionMarkup ? /*#__PURE__*/React.createElement("div", {
    className: actionClassName
  }, /*#__PURE__*/React.createElement(ButtonGroup, null, primaryActionMarkup, secondaryActionMarkup)) : null;
  const mediaCardClassName = classNames(styles.MediaCard, portrait && styles.portrait);
  const mediaContainerClassName = classNames(styles.MediaContainer, portrait && styles.portrait, size === 'small' && styles.sizeSmall);
  const infoContainerClassName = classNames(styles.InfoContainer, portrait && styles.portrait, size === 'small' && styles.sizeSmall);
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: mediaCardClassName
  }, /*#__PURE__*/React.createElement("div", {
    className: mediaContainerClassName
  }, children), /*#__PURE__*/React.createElement("div", {
    className: infoContainerClassName
  }, /*#__PURE__*/React.createElement(Card.Section, null, popoverActionsMarkup, /*#__PURE__*/React.createElement(Stack, {
    vertical: true,
    spacing: "tight"
  }, headerMarkup, /*#__PURE__*/React.createElement("p", {
    className: styles.Description
  }, description), actionMarkup)))));
}

export { MediaCard };
