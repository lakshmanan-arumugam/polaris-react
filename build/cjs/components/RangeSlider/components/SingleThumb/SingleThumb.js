'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var clamp = require('../../../../utilities/clamp.js');
var index = require('../../utilities/index.js');
var SingleThumb$1 = require('./SingleThumb.scss.js');
var invertNumber = require('../../utilities/invertNumber.js');
var Labelled = require('../../../Labelled/Labelled.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function SingleThumb(props) {
  const {
    id,
    error,
    helpText,
    value,
    min,
    max,
    disabled,
    output,
    prefix,
    suffix,
    label,
    labelAction,
    labelHidden,
    step,
    onBlur,
    onFocus
  } = props;
  const clampedValue = clamp.clamp(value, min, max);
  const describedBy = [];

  if (error) {
    describedBy.push(`${id}Error`);
  }

  if (helpText) {
    describedBy.push(Labelled.helpTextID(id));
  }

  const ariaDescribedBy = describedBy.length ? describedBy.join(' ') : undefined;
  const sliderProgress = (clampedValue - min) * 100 / (max - min);
  const outputFactor = invertNumber.invertNumber((sliderProgress - 50) / 100);
  const cssVars = {
    [`${index.CSS_VAR_PREFIX}min`]: min,
    [`${index.CSS_VAR_PREFIX}max`]: max,
    [`${index.CSS_VAR_PREFIX}current`]: clampedValue,
    [`${index.CSS_VAR_PREFIX}progress`]: `${sliderProgress}%`,
    [`${index.CSS_VAR_PREFIX}output-factor`]: `${outputFactor}`
  };
  const outputMarkup = !disabled && output && /*#__PURE__*/React__default['default'].createElement("output", {
    htmlFor: id,
    className: SingleThumb$1['default'].Output
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: SingleThumb$1['default'].OutputBubble
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: SingleThumb$1['default'].OutputText
  }, clampedValue)));
  const prefixMarkup = prefix && /*#__PURE__*/React__default['default'].createElement("div", {
    className: SingleThumb$1['default'].Prefix
  }, prefix);
  const suffixMarkup = suffix && /*#__PURE__*/React__default['default'].createElement("div", {
    className: SingleThumb$1['default'].Suffix
  }, suffix);
  const className = css.classNames(SingleThumb$1['default'].SingleThumb, error && SingleThumb$1['default'].error, disabled && SingleThumb$1['default'].disabled);
  /* eslint-disable @shopify/react-require-autocomplete */

  return /*#__PURE__*/React__default['default'].createElement(Labelled.Labelled, {
    id: id,
    label: label,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    style: cssVars
  }, prefixMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: SingleThumb$1['default'].InputWrapper
  }, /*#__PURE__*/React__default['default'].createElement("input", {
    type: "range",
    className: SingleThumb$1['default'].Input,
    id: id,
    name: id,
    min: min,
    max: max,
    step: step,
    value: clampedValue,
    disabled: disabled,
    onChange: handleChange,
    onFocus: onFocus,
    onBlur: onBlur,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": clampedValue,
    "aria-invalid": Boolean(error),
    "aria-describedby": ariaDescribedBy
  }), outputMarkup), suffixMarkup));
  /* eslint-enable @shopify/react-require-autocomplete */

  function handleChange(event) {
    const {
      onChange
    } = props;
    onChange && onChange(parseFloat(event.currentTarget.value), id);
  }
}

exports.SingleThumb = SingleThumb;
