import React from 'react';
import { SelectMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css.js';
import styles from './Select.scss.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { Icon } from '../Icon/Icon.js';
import { Labelled, helpTextID } from '../Labelled/Labelled.js';

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
  const id = useUniqueId('Select', idProp);
  const labelHidden = labelInline ? true : labelHiddenProp;
  const className = classNames(styles.Select, error && styles.error, disabled && styles.disabled);
  const handleChange = onChange ? event => onChange(event.currentTarget.value, id) : undefined;
  const describedBy = [];

  if (helpText) {
    describedBy.push(helpTextID(id));
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

  const inlineLabelMarkup = labelInline && /*#__PURE__*/React.createElement("span", {
    className: styles.InlineLabel
  }, label);
  const selectedOption = getSelectedOption(normalizedOptions, value);
  const prefixMarkup = selectedOption.prefix && /*#__PURE__*/React.createElement("div", {
    className: styles.Prefix
  }, selectedOption.prefix);
  const contentMarkup = /*#__PURE__*/React.createElement("div", {
    className: styles.Content,
    "aria-hidden": true,
    "aria-disabled": disabled
  }, inlineLabelMarkup, prefixMarkup, /*#__PURE__*/React.createElement("span", {
    className: styles.SelectedOption
  }, selectedOption.label), /*#__PURE__*/React.createElement("span", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: SelectMinor
  })));
  const optionsMarkup = normalizedOptions.map(renderOption);
  return /*#__PURE__*/React.createElement(Labelled, {
    id: id,
    label: label,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText,
    requiredIndicator: requiredIndicator
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("select", {
    id: id,
    name: name,
    value: value,
    className: styles.Input,
    disabled: disabled,
    onFocus: onFocus,
    onBlur: onBlur,
    onChange: handleChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy.length ? describedBy.join(' ') : undefined,
    "aria-required": requiredIndicator
  }, optionsMarkup), contentMarkup, /*#__PURE__*/React.createElement("div", {
    className: styles.Backdrop
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
  return /*#__PURE__*/React.createElement("option", Object.assign({
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
    return /*#__PURE__*/React.createElement("optgroup", {
      label: title,
      key: title
    }, options.map(renderSingleOption));
  }

  return renderSingleOption(optionOrGroup);
}

export { Select };
