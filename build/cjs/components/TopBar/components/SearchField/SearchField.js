'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../../../utilities/css.js');
var SearchField$1 = require('./SearchField.scss.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var hooks$1 = require('../../../../utilities/unique-id/hooks.js');
var Icon = require('../../../Icon/Icon.js');
var VisuallyHidden = require('../../../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function SearchField({
  value,
  focused,
  active,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  onCancel,
  showFocusBorder
}) {
  const i18n = hooks.useI18n();
  const [forceActive, setForceActive] = React.useState(false);
  const input = React.useRef(null);
  const searchId = hooks$1.useUniqueId('SearchField');
  const handleChange = React.useCallback(({
    currentTarget
  }) => {
    onChange(currentTarget.value);
  }, [onChange]);
  const handleFocus = React.useCallback(() => onFocus && onFocus(), [onFocus]);
  const handleBlur = React.useCallback(() => onBlur && onBlur(), [onBlur]);
  const handleClear = React.useCallback(() => {
    onCancel && onCancel();

    if (!input.current) {
      return;
    }

    input.current.value = '';
    onChange('');
    input.current.focus();
  }, [onCancel, onChange]);
  React.useEffect(() => {
    if (!input.current) {
      return;
    }

    if (focused) {
      input.current.focus();
    } else {
      input.current.blur();
    }
  }, [focused]);
  const clearMarkup = value !== '' && /*#__PURE__*/React__default['default'].createElement("button", {
    type: "button",
    "aria-label": i18n.translate('Polaris.TopBar.SearchField.clearButtonLabel'),
    className: SearchField$1['default'].Clear,
    onClick: handleClear,
    onBlur: () => {
      setForceActive(false);
      handleClear();
    },
    onFocus: () => {
      handleFocus();
      setForceActive(true);
    }
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.CircleCancelMinor
  }));
  const className = css.classNames(SearchField$1['default'].SearchField, (focused || active || forceActive) && SearchField$1['default'].focused);
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    onFocus: handleFocus,
    onBlur: handleBlur
  }, /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, /*#__PURE__*/React__default['default'].createElement("label", {
    htmlFor: searchId
  }, i18n.translate('Polaris.TopBar.SearchField.search'))), /*#__PURE__*/React__default['default'].createElement("input", {
    id: searchId,
    className: SearchField$1['default'].Input,
    placeholder: placeholder,
    type: "search",
    autoCapitalize: "off",
    autoComplete: "off",
    autoCorrect: "off",
    ref: input,
    value: value,
    onChange: handleChange,
    onKeyDown: preventDefault
  }), /*#__PURE__*/React__default['default'].createElement("span", {
    className: SearchField$1['default'].Icon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: polarisIcons.SearchMinor
  })), clearMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: css.classNames(SearchField$1['default'].Backdrop, showFocusBorder && SearchField$1['default'].BackdropShowFocusBorder)
  }));
}

function preventDefault(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
}

exports.SearchField = SearchField;
