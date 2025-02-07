'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var MappedAction$1 = require('./MappedAction.scss.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var Icon = require('../../../Icon/Icon.js');
var Badge = require('../../../Badge/Badge.js');
var TextStyle = require('../../../TextStyle/TextStyle.js');
var context = require('../../../../utilities/autocomplete/context.js');
var Listbox = require('../../../Listbox/Listbox.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function MappedAction({
  active,
  content,
  disabled,
  icon,
  image,
  prefix,
  suffix,
  ellipsis,
  role,
  url,
  external,
  onAction,
  destructive,
  badge,
  helpText,
  wrapOverflow = false
}) {
  const i18n = hooks.useI18n();
  let prefixMarkup = null;
  const contentOverflowStyle = wrapOverflow ? MappedAction$1['default'].ContentWrap : undefined;

  if (prefix) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: MappedAction$1['default'].Prefix
    }, prefix);
  } else if (icon) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: MappedAction$1['default'].Prefix
    }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
      source: icon
    }));
  } else if (image) {
    prefixMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      role: "presentation",
      className: MappedAction$1['default'].Prefix,
      style: {
        backgroundImage: `url(${image}`
      }
    });
  }

  const badgeMarkup = badge && /*#__PURE__*/React__default['default'].createElement("span", {
    className: MappedAction$1['default'].Suffix
  }, /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
    status: badge.status
  }, badge.content));
  const suffixMarkup = suffix && /*#__PURE__*/React__default['default'].createElement("span", {
    className: MappedAction$1['default'].Suffix
  }, suffix);
  const contentText = ellipsis && content ? i18n.translate('Polaris.Autocomplete.ellipsis', {
    content
  }) : content;
  const contentMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: MappedAction$1['default'].Text
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: contentOverflowStyle
  }, contentText), helpText ? /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, helpText) : null);
  const context$1 = React.useMemo(() => ({
    role,
    url,
    external,
    onAction,
    destructive
  }), [role, url, external, onAction, destructive]);
  const actionClassNames = css.classNames(MappedAction$1['default'].Action, disabled && MappedAction$1['default'].disabled, destructive && MappedAction$1['default'].destructive, active && MappedAction$1['default'].selected);
  return /*#__PURE__*/React__default['default'].createElement(context.MappedActionContext.Provider, {
    value: context$1
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: MappedAction$1['default'].ActionContainer
  }, /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Action, {
    selected: active,
    disabled: disabled,
    value: content || ''
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: actionClassNames
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: MappedAction$1['default'].Content
  }, prefixMarkup, contentMarkup, badgeMarkup, suffixMarkup)))));
}

exports.MappedAction = MappedAction;
