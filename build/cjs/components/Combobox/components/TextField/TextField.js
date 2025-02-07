'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var hooks = require('../../../../utilities/combobox/hooks.js');
var TextField$1 = require('../../../TextField/TextField.js');
var hooks$1 = require('../../../../utilities/unique-id/hooks.js');
var Label = require('../../../Label/Label.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function TextField({
  value,
  id: idProp,
  onFocus,
  onBlur,
  onChange,
  ...rest
}) {
  const comboboxTextFieldContext = hooks.useComboboxTextField();
  const {
    activeOptionId,
    listboxId,
    expanded,
    setTextFieldFocused,
    setTextFieldLabelId,
    onTextFieldFocus,
    onTextFieldChange,
    onTextFieldBlur
  } = comboboxTextFieldContext;
  const uniqueId = hooks$1.useUniqueId('ComboboxTextField');
  const textFieldId = React.useMemo(() => idProp || uniqueId, [uniqueId, idProp]);
  const labelId = React.useMemo(() => Label.labelID(idProp || uniqueId), [uniqueId, idProp]);
  React.useEffect(() => {
    if (setTextFieldLabelId) setTextFieldLabelId(labelId);
  }, [labelId, setTextFieldLabelId]);
  const handleFocus = React.useCallback(() => {
    if (onFocus) onFocus();
    if (onTextFieldFocus) onTextFieldFocus();
    if (setTextFieldFocused) setTextFieldFocused(true);
  }, [onFocus, onTextFieldFocus, setTextFieldFocused]);
  const handleBlur = React.useCallback(() => {
    if (onBlur) onBlur();
    if (onTextFieldBlur) onTextFieldBlur();
    if (setTextFieldFocused) setTextFieldFocused(false);
  }, [onBlur, onTextFieldBlur, setTextFieldFocused]);
  const handleChange = React.useCallback((value, id) => {
    if (onChange) onChange(value, id);
    if (onTextFieldChange) onTextFieldChange();
  }, [onChange, onTextFieldChange]);
  return /*#__PURE__*/React__default['default'].createElement(TextField$1.TextField, Object.assign({}, rest, {
    value: value,
    id: textFieldId,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
    ariaAutocomplete: "list",
    "aria-haspopup": "listbox",
    ariaActiveDescendant: activeOptionId,
    ariaControls: listboxId,
    role: "combobox",
    ariaExpanded: expanded
  }));
}

exports.TextField = TextField;
