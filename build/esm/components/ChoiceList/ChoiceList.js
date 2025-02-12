import React from 'react';
import { classNames } from '../../utilities/css.js';
import styles from './ChoiceList.scss.js';
import { RadioButton } from '../RadioButton/RadioButton.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';
import { errorTextID, InlineError } from '../InlineError/InlineError.js';
import { Checkbox } from '../Checkbox/Checkbox.js';

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
  const ControlComponent = allowMultiple ? Checkbox : RadioButton;
  const name = useUniqueId('ChoiceList', nameProp);
  const finalName = allowMultiple ? `${name}[]` : name;
  const className = classNames(styles.ChoiceList, titleHidden && styles.titleHidden);
  const titleMarkup = title ? /*#__PURE__*/React.createElement("legend", {
    className: styles.Title
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
    const children = renderedChildren ? /*#__PURE__*/React.createElement("div", {
      className: styles.ChoiceChildren
    }, renderedChildren) : null;
    return /*#__PURE__*/React.createElement("li", {
      key: value
    }, /*#__PURE__*/React.createElement(ControlComponent, {
      name: finalName,
      value: value,
      label: label,
      disabled: choiceDisabled || disabled,
      checked: choiceIsSelected(choice, selected),
      helpText: helpText,
      onChange: handleChange,
      ariaDescribedBy: error && describedByError ? errorTextID(finalName) : null
    }), children);
  });
  const errorMarkup = error && /*#__PURE__*/React.createElement("div", {
    className: styles.ChoiceError
  }, /*#__PURE__*/React.createElement(InlineError, {
    message: error,
    fieldID: finalName
  }));
  return /*#__PURE__*/React.createElement("fieldset", {
    className: className,
    id: finalName,
    "aria-invalid": error != null
  }, titleMarkup, /*#__PURE__*/React.createElement("ul", {
    className: styles.Choices
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

export { ChoiceList };
