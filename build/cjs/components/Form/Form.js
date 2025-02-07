'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var hooks = require('../../utilities/i18n/hooks.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Form({
  acceptCharset,
  action,
  autoComplete,
  children,
  encType,
  implicitSubmit = true,
  method = 'post',
  name,
  noValidate,
  preventDefault = true,
  target,
  onSubmit
}) {
  const i18n = hooks.useI18n();
  const handleSubmit = React.useCallback(event => {
    if (!preventDefault) {
      return;
    }

    event.preventDefault();
    onSubmit(event);
  }, [onSubmit, preventDefault]);
  const autoCompleteInputs = normalizeAutoComplete(autoComplete);
  const submitMarkup = implicitSubmit ? /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, /*#__PURE__*/React__default['default'].createElement("button", {
    type: "submit",
    "aria-hidden": "true",
    tabIndex: -1
  }, i18n.translate('Polaris.Common.submit'))) : null;
  return /*#__PURE__*/React__default['default'].createElement("form", {
    acceptCharset: acceptCharset,
    action: action,
    autoComplete: autoCompleteInputs,
    encType: encType,
    method: method,
    name: name,
    noValidate: noValidate,
    target: target,
    onSubmit: handleSubmit
  }, children, submitMarkup);
}

function normalizeAutoComplete(autoComplete) {
  if (autoComplete == null) {
    return autoComplete;
  }

  return autoComplete ? 'on' : 'off';
}

exports.Form = Form;
