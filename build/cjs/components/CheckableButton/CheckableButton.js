'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var CheckableButton$1 = require('./CheckableButton.scss.js');
var context = require('../../utilities/resource-list/context.js');
var Checkbox = require('../Checkbox/Checkbox.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function CheckableButton({
  accessibilityLabel,
  label = '',
  onToggleAll,
  selected,
  selectMode,
  plain,
  measuring,
  disabled,
  smallScreen
}) {
  const checkBoxRef = React.useRef(null);
  const {
    registerCheckableButtons
  } = React.useContext(context.ResourceListContext);
  let currentKey = 'bulkLg';

  if (plain) {
    currentKey = 'plain';
  } else if (smallScreen) {
    currentKey = 'bulkSm';
  }

  React.useEffect(() => {
    if (checkBoxRef.current && registerCheckableButtons) {
      registerCheckableButtons(currentKey, checkBoxRef.current);
    }
  }, [currentKey, registerCheckableButtons]);
  const className = plain ? css.classNames(CheckableButton$1['default'].CheckableButton, CheckableButton$1['default']['CheckableButton-plain']) : css.classNames(CheckableButton$1['default'].CheckableButton, selectMode && CheckableButton$1['default']['CheckableButton-selectMode'], selected && CheckableButton$1['default']['CheckableButton-selected'], measuring && CheckableButton$1['default']['CheckableButton-measuring']);
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    onClick: onToggleAll
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: CheckableButton$1['default'].Checkbox
  }, /*#__PURE__*/React__default['default'].createElement(Checkbox.Checkbox, {
    label: accessibilityLabel,
    labelHidden: true,
    checked: selected,
    disabled: disabled,
    onChange: onToggleAll,
    ref: checkBoxRef
  })), /*#__PURE__*/React__default['default'].createElement("span", {
    className: CheckableButton$1['default'].Label
  }, label));
}

exports.CheckableButton = CheckableButton;
