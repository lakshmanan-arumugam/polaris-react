'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var useToggle = require('../../utilities/use-toggle.js');
var css = require('../../utilities/css.js');
var MediaCard$1 = require('./MediaCard.scss.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Button = require('../Button/Button.js');
var Popover = require('../Popover/Popover.js');
var ActionList = require('../ActionList/ActionList.js');
var utils = require('../Button/utils.js');
var Card = require('../Card/Card.js');
var Stack = require('../Stack/Stack.js');
var Heading = require('../Heading/Heading.js');
var ButtonGroup = require('../ButtonGroup/ButtonGroup.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const i18n = hooks.useI18n();
  const {
    value: popoverActive,
    toggle: togglePopoverActive
  } = useToggle.useToggle(false);
  let headerMarkup = null;

  if (title) {
    const headerContent = typeof title === 'string' ? /*#__PURE__*/React__default['default'].createElement(Heading.Heading, null, title) : title;
    headerMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: MediaCard$1['default'].Heading
    }, headerContent);
  }

  const popoverActivator = /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    icon: polarisIcons.HorizontalDotsMinor,
    onClick: togglePopoverActive,
    size: "slim",
    plain: true,
    accessibilityLabel: i18n.translate('Polaris.MediaCard.popoverButton')
  });
  const popoverActionsMarkup = popoverActions.length > 0 ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: MediaCard$1['default'].Popover
  }, /*#__PURE__*/React__default['default'].createElement(Popover.Popover, {
    active: popoverActive,
    activator: popoverActivator,
    onClose: togglePopoverActive,
    preferredAlignment: "left",
    preferredPosition: "below"
  }, /*#__PURE__*/React__default['default'].createElement(ActionList.ActionList, {
    items: popoverActions,
    onActionAnyItem: togglePopoverActive
  }))) : null;
  const primaryActionMarkup = primaryAction ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: MediaCard$1['default'].PrimaryAction
  }, utils.buttonFrom(primaryAction)) : null;
  const secondaryActionMarkup = secondaryAction ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: MediaCard$1['default'].SecondaryAction
  }, utils.buttonFrom(secondaryAction, {
    plain: true
  })) : null;
  const actionClassName = css.classNames(MediaCard$1['default'].ActionContainer, portrait && MediaCard$1['default'].portrait);
  const actionMarkup = primaryActionMarkup || secondaryActionMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: actionClassName
  }, /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, null, primaryActionMarkup, secondaryActionMarkup)) : null;
  const mediaCardClassName = css.classNames(MediaCard$1['default'].MediaCard, portrait && MediaCard$1['default'].portrait);
  const mediaContainerClassName = css.classNames(MediaCard$1['default'].MediaContainer, portrait && MediaCard$1['default'].portrait, size === 'small' && MediaCard$1['default'].sizeSmall);
  const infoContainerClassName = css.classNames(MediaCard$1['default'].InfoContainer, portrait && MediaCard$1['default'].portrait, size === 'small' && MediaCard$1['default'].sizeSmall);
  return /*#__PURE__*/React__default['default'].createElement(Card.Card, null, /*#__PURE__*/React__default['default'].createElement("div", {
    className: mediaCardClassName
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: mediaContainerClassName
  }, children), /*#__PURE__*/React__default['default'].createElement("div", {
    className: infoContainerClassName
  }, /*#__PURE__*/React__default['default'].createElement(Card.Card.Section, null, popoverActionsMarkup, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    vertical: true,
    spacing: "tight"
  }, headerMarkup, /*#__PURE__*/React__default['default'].createElement("p", {
    className: MediaCard$1['default'].Description
  }, description), actionMarkup)))));
}

exports.MediaCard = MediaCard;
