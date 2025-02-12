import React, { useCallback } from 'react';
import { useToggle } from '../../../../utilities/use-toggle.js';
import { classNames, variationName } from '../../../../utilities/css.js';
import styles from './Option.scss.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Scrollable } from '../../../Scrollable/Scrollable.js';

function Option({
  label,
  value,
  id,
  select,
  active,
  allowMultiple,
  disabled,
  role,
  media,
  onClick,
  section,
  index,
  verticalAlign
}) {
  const {
    value: focused,
    toggle: toggleFocused
  } = useToggle(false);
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }

    onClick(section, index);
  }, [disabled, index, onClick, section]);
  const mediaMarkup = media ? /*#__PURE__*/React.createElement("div", {
    className: styles.Media
  }, media) : null;
  const singleSelectClassName = classNames(styles.SingleSelectOption, focused && styles.focused, disabled && styles.disabled, select && styles.select, active && styles.active, verticalAlign && styles[variationName('verticalAlign', verticalAlign)]);
  const multiSelectClassName = classNames(styles.Label, disabled && styles.disabled, active && styles.active, select && styles.select, verticalAlign && styles[variationName('verticalAlign', verticalAlign)]);
  const checkBoxRole = role === 'option' ? 'presentation' : undefined;
  const optionMarkup = allowMultiple ? /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    className: multiSelectClassName
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Checkbox
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: id,
    value: value,
    checked: select,
    active: active,
    disabled: disabled,
    onChange: handleClick,
    role: checkBoxRole
  })), mediaMarkup, label) : /*#__PURE__*/React.createElement("button", {
    id: id,
    type: "button",
    className: singleSelectClassName,
    onClick: handleClick,
    disabled: disabled,
    onFocus: toggleFocused,
    onBlur: toggleFocused,
    "aria-pressed": active
  }, mediaMarkup, label);
  const scrollMarkup = active ? /*#__PURE__*/React.createElement(Scrollable.ScrollTo, null) : null;
  return /*#__PURE__*/React.createElement("li", {
    key: id,
    className: styles.Option,
    tabIndex: -1
  }, scrollMarkup, optionMarkup);
}

export { Option };
