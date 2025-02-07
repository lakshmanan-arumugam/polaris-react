'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var Select$1 = require('./Select.scss.js');
var hooks = require('../../utilities/unique-id/hooks.js');
var Icon = require('../Icon/Icon.js');
var Labelled = require('../Labelled/Labelled.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const PLACEHOLDER_VALUE = '';
function Select({
  options: optionsProp,
  label,
  labelAction,
  labelHidden: labelHiddenProp,
  labelInline,
  disabled,
  helpText,
  placeholder,
  id: idProp,
  name,
  value = PLACEHOLDER_VALUE,
  error,
  onChange,
  onFocus,
  onBlur,
  requiredIndicator
}) {
  const id = hooks.useUniqueId('Select', idProp);
  const labelHidden = labelInline ? true : labelHiddenProp;
  const className = css.classNames(Select$1['default'].Select, error && Select$1['default'].error, disabled && Select$1['default'].disabled);
  const handleChange = onChange ? event => onChange(event.currentTarget.value, id) : undefined;
  const describedBy = [];

  if (helpText) {
    describedBy.push(Labelled.helpTextID(id));
  }

  if (error) {
    describedBy.push(`${id}Error`);
  }

  const options = optionsProp || [];
  let normalizedOptions = options.map(normalizeOption);

  if (placeholder) {
    normalizedOptions = [{
      label: placeholder,
      value: PLACEHOLDER_VALUE,
      disabled: true
    }, ...normalizedOptions];
  }

  const inlineLabelMarkup = labelInline && /*#__PURE__*/React__default['default'].createElement("span", {
    className: Select$1['default'].InlineLabel
  }, label);
  const selectedOption = getSelectedOption(normalizedOptions, value);
  const prefixMarkup = selectedOption.prefix && /*#__PURE__*/React__default['default'].createElement("div", {
    className: Select$1['default'].Prefix
  }, selectedOption.prefix);
  const contentMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: Select$1['default'].Content,
    "aria-hidden": true,
    "aria-disabled": disabled
  }, inlineLabelMarkup, prefixMarkup, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Select$1['default'].SelectedOption
  }, selectedOption.label), /*#__PURE__*/React__default['default'].createElement("span", {
    className: Select$1['default'].Icon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.SelectMinor
  })));
  const optionsMarkup = normalizedOptions.map(renderOption);
  return /*#__PURE__*/React__default['default'].createElement(Labelled.Labelled, {
    id: id,
    label: label,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText,
    requiredIndicator: requiredIndicator
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, /*#__PURE__*/React__default['default'].createElement("select", {
    id: id,
    name: name,
    value: value,
    className: Select$1['default'].Input,
    disabled: disabled,
    onFocus: onFocus,
    onBlur: onBlur,
    onChange: handleChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy.length ? describedBy.join(' ') : undefined,
    "aria-required": requiredIndicator
  }, optionsMarkup), contentMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Select$1['default'].Backdrop
  })));
}

function isString(option) {
  return typeof option === 'string';
}

function isGroup(option) {
  return typeof option === 'object' && 'options' in option && option.options != null;
}

function normalizeStringOption(option) {
  return {
    label: option,
    value: option
  };
}
/**
 * Converts a string option (and each string option in a Group) into
 * an Option object.
 */


function normalizeOption(option) {
  if (isString(option)) {
    return normalizeStringOption(option);
  } else if (isGroup(option)) {
    const {
      title,
      options
    } = option;
    return {
      title,
      options: options.map(option => {
        return isString(option) ? normalizeStringOption(option) : option;
      })
    };
  }

  return option;
}
/**
 * Gets the text to display in the UI, for the currently selected option
 */


function getSelectedOption(options, value) {
  const flatOptions = flattenOptions(options);
  let selectedOption = flatOptions.find(option => value === option.value);

  if (selectedOption === undefined) {
    // Get the first visible option (not the hidden placeholder)
    selectedOption = flatOptions.find(option => !option.hidden);
  }

  return selectedOption || {
    value: '',
    label: ''
  };
}
/**
 * Ungroups an options array
 */


function flattenOptions(options) {
  let flatOptions = [];
  options.forEach(optionOrGroup => {
    if (isGroup(optionOrGroup)) {
      flatOptions = flatOptions.concat(optionOrGroup.options);
    } else {
      flatOptions.push(optionOrGroup);
    }
  });
  return flatOptions;
}

function renderSingleOption(option) {
  const {
    value,
    label,
    prefix: _prefix,
    ...rest
  } = option;
  return /*#__PURE__*/React__default['default'].createElement("option", Object.assign({
    key: value,
    value: value
  }, rest), label);
}

function renderOption(optionOrGroup) {
  if (isGroup(optionOrGroup)) {
    const {
      title,
      options
    } = optionOrGroup;
    return /*#__PURE__*/React__default['default'].createElement("optgroup", {
      label: title,
      key: title
    }, options.map(renderSingleOption));
  }

  return renderSingleOption(optionOrGroup);
}

exports.Select = Select;
