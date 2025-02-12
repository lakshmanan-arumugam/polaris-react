'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var useIsAfterInitialMount = require('../../utilities/use-is-after-initial-mount.js');
var types = require('../../types.js');
var TextField$1 = require('./TextField.scss.js');
var Labelled = require('../Labelled/Labelled.js');
var Connected = require('../Connected/Connected.js');
var Spinner = require('./components/Spinner/Spinner.js');
var Resizer = require('./components/Resizer/Resizer.js');
var Label = require('../Label/Label.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/unique-id/hooks.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');
var Icon = require('../Icon/Icon.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const i18n = hooks.useI18n();
  const [height, setHeight] = React.useState(null);
  const [focus, setFocus] = React.useState(Boolean(focused));
  const isAfterInitial = useIsAfterInitialMount.useIsAfterInitialMount();
  const id = hooks$1.useUniqueId('TextField', idProp);
  const inputRef = React.useRef(null);
  const prefixRef = React.useRef(null);
  const suffixRef = React.useRef(null);
  const buttonPressTimer = React.useRef();
  React.useEffect(() => {
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
  const className = css.classNames(TextField$1['default'].TextField, Boolean(normalizedValue) && TextField$1['default'].hasValue, disabled && TextField$1['default'].disabled, readOnly && TextField$1['default'].readOnly, error && TextField$1['default'].error, multiline && TextField$1['default'].multiline, focus && TextField$1['default'].focus);
  const inputType = type === 'currency' ? 'text' : type;
  const prefixMarkup = prefix ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: TextField$1['default'].Prefix,
    id: `${id}Prefix`,
    ref: prefixRef
  }, prefix) : null;
  const suffixMarkup = suffix ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: TextField$1['default'].Suffix,
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
    const characterCountClassName = css.classNames(TextField$1['default'].CharacterCount, multiline && TextField$1['default'].AlignFieldBottom);
    const characterCountText = !maxLength ? characterCount : `${characterCount}/${maxLength}`;
    characterCountMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      id: `${id}CharacterCounter`,
      className: characterCountClassName,
      "aria-label": characterCountLabel,
      "aria-live": focus ? 'polite' : 'off',
      "aria-atomic": "true"
    }, characterCountText);
  }

  const clearButtonVisible = normalizedValue !== '';
  const clearButtonClassNames = css.classNames(TextField$1['default'].ClearButton, !clearButtonVisible && TextField$1['default'].Hidden);
  const clearButtonMarkup = clearButton ? /*#__PURE__*/React__default['default'].createElement("button", {
    type: "button",
    className: clearButtonClassNames,
    onClick: handleClearButtonPress,
    disabled: disabled
  }, /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, i18n.translate('Polaris.Common.clear')), /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.CircleCancelMinor,
    color: "base"
  })) : null;
  const handleNumberChange = React.useCallback(steps => {
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
  const handleButtonRelease = React.useCallback(() => {
    clearTimeout(buttonPressTimer.current);
  }, []);
  const handleButtonPress = React.useCallback(onChange => {
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
  const spinnerMarkup = type === 'number' && step !== 0 && !disabled && !readOnly ? /*#__PURE__*/React__default['default'].createElement(Spinner.Spinner, {
    onChange: handleNumberChange,
    onMouseDown: handleButtonPress,
    onMouseUp: handleButtonRelease
  }) : null;
  const style = multiline && height ? {
    height,
    maxHeight
  } : null;
  const handleExpandingResize = React.useCallback(height => {
    setHeight(height);
  }, []);
  const resizer = multiline && isAfterInitial ? /*#__PURE__*/React__default['default'].createElement(Resizer.Resizer, {
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
    describedBy.push(Labelled.helpTextID(id));
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

  labelledBy.unshift(Label.labelID(id));
  const inputClassName = css.classNames(TextField$1['default'].Input, align && TextField$1['default'][css.variationName('Input-align', align)], suffix && TextField$1['default']['Input-suffixed'], clearButton && TextField$1['default']['Input-hasClearButton'], monospaced && TextField$1['default'].monospaced);
  const input = /*#__PURE__*/React.createElement(multiline ? 'textarea' : 'input', {
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
  const backdropClassName = css.classNames(TextField$1['default'].Backdrop, connectedLeft && TextField$1['default']['Backdrop-connectedLeft'], connectedRight && TextField$1['default']['Backdrop-connectedRight']);
  return /*#__PURE__*/React__default['default'].createElement(Labelled.Labelled, {
    label: label,
    id: id,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText,
    requiredIndicator: requiredIndicator
  }, /*#__PURE__*/React__default['default'].createElement(Connected.Connected, {
    left: connectedLeft,
    right: connectedRight
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick
  }, prefixMarkup, input, suffixMarkup, characterCountMarkup, clearButtonMarkup, spinnerMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
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

    if (type !== 'number' || which === types.Key.Enter || numbersSpec.test(key)) {
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

exports.TextField = TextField;
