'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var AccountConnection$1 = require('./AccountConnection.scss.js');
var Card = require('../Card/Card.js');
var SettingAction = require('../SettingAction/SettingAction.js');
var Avatar = require('../Avatar/Avatar.js');
var utils = require('../Button/utils.js');
var Stack = require('../Stack/Stack.js');
var TextStyle = require('../TextStyle/TextStyle.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function AccountConnection({
  connected = false,
  action,
  avatarUrl,
  accountName = '',
  title,
  details,
  termsOfService
}) {
  const initials = accountName ? accountName.split(/\s+/).map(name => name[0]).join('') : undefined;
  const avatarMarkup = connected ? /*#__PURE__*/React__default['default'].createElement(Avatar.Avatar, {
    accessibilityLabel: "",
    name: accountName,
    initials: initials,
    source: avatarUrl
  }) : null;
  let titleMarkup = null;

  if (title) {
    titleMarkup = /*#__PURE__*/React__default['default'].createElement("div", null, title);
  } else if (accountName) {
    titleMarkup = /*#__PURE__*/React__default['default'].createElement("div", null, accountName);
  }

  const detailsMarkup = details ? /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, details)) : null;
  const termsOfServiceMarkup = termsOfService ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: AccountConnection$1['default'].TermsOfService
  }, termsOfService) : null;
  const actionElement = action ? utils.buttonFrom(action, {
    primary: !connected
  }) : null;
  return /*#__PURE__*/React__default['default'].createElement(Card.Card, {
    sectioned: true
  }, /*#__PURE__*/React__default['default'].createElement(SettingAction.SettingAction, {
    action: actionElement
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, null, avatarMarkup, /*#__PURE__*/React__default['default'].createElement(Stack.Stack.Item, {
    fill: true
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: AccountConnection$1['default'].Content
  }, titleMarkup, detailsMarkup)))), termsOfServiceMarkup);
}

exports.AccountConnection = AccountConnection;
