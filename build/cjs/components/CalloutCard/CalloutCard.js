'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var CalloutCard$1 = require('./CalloutCard.scss.js');
var TextContainer = require('../TextContainer/TextContainer.js');
var utils = require('../Button/utils.js');
var Button = require('../Button/Button.js');
var Card = require('../Card/Card.js');
var Heading = require('../Heading/Heading.js');
var Image = require('../Image/Image.js');
var ButtonGroup = require('../ButtonGroup/ButtonGroup.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function CalloutCard({
  title,
  children,
  illustration,
  primaryAction,
  secondaryAction,
  onDismiss
}) {
  const primaryActionMarkup = utils.buttonFrom(primaryAction);
  const secondaryActionMarkup = secondaryAction ? utils.buttonFrom(secondaryAction, {
    plain: true
  }) : null;
  const buttonMarkup = secondaryActionMarkup ? /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, null, primaryActionMarkup, secondaryActionMarkup) : primaryActionMarkup;
  const dismissButton = onDismiss ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: CalloutCard$1['default'].Dismiss
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    icon: polarisIcons.CancelSmallMinor,
    onClick: onDismiss,
    accessibilityLabel: "Dismiss card"
  })) : null;
  const imageClassName = css.classNames(CalloutCard$1['default'].Image, onDismiss && CalloutCard$1['default'].DismissImage);
  const containerClassName = css.classNames(CalloutCard$1['default'].Container, onDismiss && CalloutCard$1['default'].hasDismiss);
  return /*#__PURE__*/React__default['default'].createElement(Card.Card, null, /*#__PURE__*/React__default['default'].createElement("div", {
    className: containerClassName
  }, dismissButton, /*#__PURE__*/React__default['default'].createElement(Card.Card.Section, null, /*#__PURE__*/React__default['default'].createElement("div", {
    className: CalloutCard$1['default'].CalloutCard
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: CalloutCard$1['default'].Content
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: CalloutCard$1['default'].Title
  }, /*#__PURE__*/React__default['default'].createElement(Heading.Heading, null, title)), /*#__PURE__*/React__default['default'].createElement(TextContainer.TextContainer, null, children), /*#__PURE__*/React__default['default'].createElement("div", {
    className: CalloutCard$1['default'].Buttons
  }, buttonMarkup)), /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    alt: "",
    className: imageClassName,
    source: illustration
  })))));
}

exports.CalloutCard = CalloutCard;
