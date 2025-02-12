'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var ChoiceList$1 = require('./ChoiceList.scss.js');
var RadioButton = require('../RadioButton/RadioButton.js');
var hooks = require('../../utilities/unique-id/hooks.js');
var InlineError = require('../InlineError/InlineError.js');
var Checkbox = require('../Checkbox/Checkbox.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ChoiceList({
  title,
  titleHidden,
  allowMultiple,
  choices,
  selected,
  onChange = noop,
  error,
  disabled = false,
  name: nameProp
}) {
  // Type asserting to any is required for TS3.2 but can be removed when we update to 3.3
  // see https://github.com/Microsoft/TypeScript/issues/28768
  const ControlComponent = allowMultiple ? Checkbox.Checkbox : RadioButton.RadioButton;
  const name = hooks.useUniqueId('ChoiceList', nameProp);
  const finalName = allowMultiple ? `${name}[]` : name;
  const className = css.classNames(ChoiceList$1['default'].ChoiceList, titleHidden && ChoiceList$1['default'].titleHidden);
  const titleMarkup = title ? /*#__PURE__*/React__default['default'].createElement("legend", {
    className: ChoiceList$1['default'].Title
  }, title) : null;
  const choicesMarkup = choices.map(choice => {
    const {
      value,
      label,
      helpText,
      disabled: choiceDisabled,
      describedByError
    } = choice;

    function handleChange(checked) {
      onChange(updateSelectedChoices(choice, checked, selected, allowMultiple), name);
    }

    const isSelected = choiceIsSelected(choice, selected);
    const renderedChildren = choice.renderChildren ? choice.renderChildren(isSelected) : null;
    const children = renderedChildren ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: ChoiceList$1['default'].ChoiceChildren
    }, renderedChildren) : null;
    return /*#__PURE__*/React__default['default'].createElement("li", {
      key: value
    }, /*#__PURE__*/React__default['default'].createElement(ControlComponent, {
      name: finalName,
      value: value,
      label: label,
      disabled: choiceDisabled || disabled,
      checked: choiceIsSelected(choice, selected),
      helpText: helpText,
      onChange: handleChange,
      ariaDescribedBy: error && describedByError ? InlineError.errorTextID(finalName) : null
    }), children);
  });
  const errorMarkup = error && /*#__PURE__*/React__default['default'].createElement("div", {
    className: ChoiceList$1['default'].ChoiceError
  }, /*#__PURE__*/React__default['default'].createElement(InlineError.InlineError, {
    message: error,
    fieldID: finalName
  }));
  return /*#__PURE__*/React__default['default'].createElement("fieldset", {
    className: className,
    id: finalName,
    "aria-invalid": error != null
  }, titleMarkup, /*#__PURE__*/React__default['default'].createElement("ul", {
    className: ChoiceList$1['default'].Choices
  }, choicesMarkup), errorMarkup);
}

function noop() {}

function choiceIsSelected({
  value
}, selected) {
  return selected.includes(value);
}

function updateSelectedChoices({
  value
}, checked, selected, allowMultiple = false) {
  if (checked) {
    return allowMultiple ? [...selected, value] : [value];
  }

  return selected.filter(selectedChoice => selectedChoice !== value);
}

exports.ChoiceList = ChoiceList;
