import React, { useState, useRef, useEffect, useCallback, createElement } from 'react';
import { CircleCancelMinor } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../utilities/css.js';
import { useIsAfterInitialMount } from '../../utilities/use-is-after-initial-mount.js';
import { Key } from '../../types.js';
import styles from './TextField.scss.js';
import { Labelled, helpTextID } from '../Labelled/Labelled.js';
import { Connected } from '../Connected/Connected.js';
import { Spinner } from './components/Spinner/Spinner.js';
import { Resizer } from './components/Resizer/Resizer.js';
import { labelID } from '../Label/Label.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';
import { Icon } from '../Icon/Icon.js';

function TextField({
  prefix,
  suffix,
  placeholder,
  value,
  helpText,
  label,
  labelAction,
  labelHidden,
  disabled,
  clearButton,
  readOnly,
  autoFocus,
  focused,
  multiline,
  error,
  connectedRight,
  connectedLeft,
  type,
  name,
  id: idProp,
  role,
  step,
  autoComplete,
  max,
  maxLength,
  maxHeight,
  min,
  minLength,
  pattern,
  inputMode,
  spellCheck,
  ariaOwns,
  ariaControls,
  ariaExpanded,
  ariaActiveDescendant,
  ariaAutocomplete,
  showCharacterCount,
  align,
  onClearButtonClick,
  onChange,
  onFocus,
  onBlur,
  requiredIndicator,
  monospaced
}) {
  const i18n = useI18n();
  const [height, setHeight] = useState(null);
  const [focus, setFocus] = useState(Boolean(focused));
  const isAfterInitial = useIsAfterInitialMount();
  const id = useUniqueId('TextField', idProp);
  const inputRef = useRef(null);
  const prefixRef = useRef(null);
  const suffixRef = useRef(null);
  const buttonPressTimer = useRef();
  useEffect(() => {
    const input = inputRef.current;
    if (!input || focused === undefined) return;
    focused ? input.focus() : input.blur();
  }, [focused]); // Use a typeof check here as Typescript mostly protects us from non-stringy
  // values but overzealous usage of `any` in consuming apps means people have
  // been known to pass a number in, so make it clear that doesn't work.

  const normalizedValue = typeof value === 'string' ? value : '';
  const normalizedStep = step != null ? step : 1;
  const normalizedMax = max != null ? max : Infinity;
  const normalizedMin = min != null ? min : -Infinity;
  const className = classNames(styles.TextField, Boolean(normalizedValue) && styles.hasValue, disabled && styles.disabled, readOnly && styles.readOnly, error && styles.error, multiline && styles.multiline, focus && styles.focus);
  const inputType = type === 'currency' ? 'text' : type;
  const prefixMarkup = prefix ? /*#__PURE__*/React.createElement("div", {
    className: styles.Prefix,
    id: `${id}Prefix`,
    ref: prefixRef
  }, prefix) : null;
  const suffixMarkup = suffix ? /*#__PURE__*/React.createElement("div", {
    className: styles.Suffix,
    id: `${id}Suffix`,
    ref: suffixRef
  }, suffix) : null;
  let characterCountMarkup = null;

  if (showCharacterCount) {
    const characterCount = normalizedValue.length;
    const characterCountLabel = maxLength ? i18n.translate('Polaris.TextField.characterCountWithMaxLength', {
      count: characterCount,
      limit: maxLength
    }) : i18n.translate('Polaris.TextField.characterCount', {
      count: characterCount
    });
    const characterCountClassName = classNames(styles.CharacterCount, multiline && styles.AlignFieldBottom);
    const characterCountText = !maxLength ? characterCount : `${characterCount}/${maxLength}`;
    characterCountMarkup = /*#__PURE__*/React.createElement("div", {
      id: `${id}CharacterCounter`,
      className: characterCountClassName,
      "aria-label": characterCountLabel,
      "aria-live": focus ? 'polite' : 'off',
      "aria-atomic": "true"
    }, characterCountText);
  }

  const clearButtonVisible = normalizedValue !== '';
  const clearButtonClassNames = classNames(styles.ClearButton, !clearButtonVisible && styles.Hidden);
  const clearButtonMarkup = clearButton ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: clearButtonClassNames,
    onClick: handleClearButtonPress,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(VisuallyHidden, null, i18n.translate('Polaris.Common.clear')), /*#__PURE__*/React.createElement(Icon, {
    source: CircleCancelMinor,
    color: "base"
  })) : null;
  const handleNumberChange = useCallback(steps => {
    if (onChange == null) {
      return;
    } // Returns the length of decimal places in a number


    const dpl = num => (num.toString().split('.')[1] || []).length;

    const numericValue = value ? parseFloat(value) : 0;

    if (isNaN(numericValue)) {
      return;
    } // Making sure the new value has the same length of decimal places as the
    // step / value has.


    const decimalPlaces = Math.max(dpl(numericValue), dpl(normalizedStep));
    const newValue = Math.min(Number(normalizedMax), Math.max(numericValue + steps * normalizedStep, Number(normalizedMin)));
    onChange(String(newValue.toFixed(decimalPlaces)), id);
  }, [id, normalizedMax, normalizedMin, onChange, normalizedStep, value]);
  const handleButtonRelease = useCallback(() => {
    clearTimeout(buttonPressTimer.current);
  }, []);
  const handleButtonPress = useCallback(onChange => {
    const minInterval = 50;
    const decrementBy = 10;
    let interval = 200;

    const onChangeInterval = () => {
      if (interval > minInterval) interval -= decrementBy;
      onChange(0);
      buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
    };

    buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
    document.addEventListener('mouseup', handleButtonRelease, {
      once: true
    });
  }, [handleButtonRelease]);
  const spinnerMarkup = type === 'number' && step !== 0 && !disabled && !readOnly ? /*#__PURE__*/React.createElement(Spinner, {
    onChange: handleNumberChange,
    onMouseDown: handleButtonPress,
    onMouseUp: handleButtonRelease
  }) : null;
  const style = multiline && height ? {
    height,
    maxHeight
  } : null;
  const handleExpandingResize = useCallback(height => {
    setHeight(height);
  }, []);
  const resizer = multiline && isAfterInitial ? /*#__PURE__*/React.createElement(Resizer, {
    contents: normalizedValue || placeholder,
    currentHeight: height,
    minimumLines: typeof multiline === 'number' ? multiline : 1,
    onHeightChange: handleExpandingResize
  }) : null;
  const describedBy = [];

  if (error) {
    describedBy.push(`${id}Error`);
  }

  if (helpText) {
    describedBy.push(helpTextID(id));
  }

  if (showCharacterCount) {
    describedBy.push(`${id}CharacterCounter`);
  }

  const labelledBy = [];

  if (prefix) {
    labelledBy.push(`${id}Prefix`);
  }

  if (suffix) {
    labelledBy.push(`${id}Suffix`);
  }

  labelledBy.unshift(labelID(id));
  const inputClassName = classNames(styles.Input, align && styles[variationName('Input-align', align)], suffix && styles['Input-suffixed'], clearButton && styles['Input-hasClearButton'], monospaced && styles.monospaced);
  const input = /*#__PURE__*/createElement(multiline ? 'textarea' : 'input', {
    name,
    id,
    disabled,
    readOnly,
    role,
    autoFocus,
    value: normalizedValue,
    placeholder,
    onFocus,
    onBlur,
    onKeyPress: handleKeyPress,
    style,
    autoComplete,
    className: inputClassName,
    onChange: handleChange,
    ref: inputRef,
    min,
    max,
    step,
    minLength,
    maxLength,
    spellCheck,
    pattern,
    inputMode,
    type: inputType,
    'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    'aria-labelledby': labelledBy.join(' '),
    'aria-invalid': Boolean(error),
    'aria-owns': ariaOwns,
    'aria-activedescendant': ariaActiveDescendant,
    'aria-autocomplete': ariaAutocomplete,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-required': requiredIndicator,
    ...normalizeAriaMultiline(multiline)
  });
  const backdropClassName = classNames(styles.Backdrop, connectedLeft && styles['Backdrop-connectedLeft'], connectedRight && styles['Backdrop-connectedRight']);
  return /*#__PURE__*/React.createElement(Labelled, {
    label: label,
    id: id,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText,
    requiredIndicator: requiredIndicator
  }, /*#__PURE__*/React.createElement(Connected, {
    left: connectedLeft,
    right: connectedRight
  }, /*#__PURE__*/React.createElement("div", {
    className: className,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick
  }, prefixMarkup, input, suffixMarkup, characterCountMarkup, clearButtonMarkup, spinnerMarkup, /*#__PURE__*/React.createElement("div", {
    className: backdropClassName
  }), resizer)));

  function handleClearButtonPress() {
    onClearButtonClick && onClearButtonClick(id);
  }

  function handleKeyPress(event) {
    const {
      key,
      which
    } = event;
    const numbersSpec = /[\d.eE+-]$/;

    if (type !== 'number' || which === Key.Enter || numbersSpec.test(key)) {
      return;
    }

    event.preventDefault();
  }

  function containsAffix(target) {
    return target instanceof HTMLElement && (prefixRef.current && prefixRef.current.contains(target) || suffixRef.current && suffixRef.current.contains(target));
  }

  function handleChange(event) {
    onChange && onChange(event.currentTarget.value, id);
  }

  function handleFocus({
    target
  }) {
    if (containsAffix(target)) {
      return;
    }

    setFocus(true);
  }

  function handleBlur() {
    setFocus(false);
  }

  function handleClick({
    target
  }) {
    var _inputRef$current;

    if (containsAffix(target) || focus) {
      return;
    }

    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
  }
}

function normalizeAriaMultiline(multiline) {
  if (!multiline) return undefined;
  return Boolean(multiline) || multiline > 0 ? {
    'aria-multiline': true
  } : undefined;
}

export { TextField };
