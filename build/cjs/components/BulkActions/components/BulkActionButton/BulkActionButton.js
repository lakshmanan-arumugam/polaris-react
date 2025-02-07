'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useComponentDidMount = require('../../../../utilities/use-component-did-mount.js');
var BulkActions = require('../../BulkActions.scss.js');
var Indicator = require('../../../Indicator/Indicator.js');
var Button = require('../../../Button/Button.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function BulkActionButton({
  handleMeasurement,
  url,
  external,
  onAction,
  content,
  disclosure,
  accessibilityLabel,
  disabled,
  indicator
}) {
  const bulkActionButton = React.useRef(null);
  useComponentDidMount.useComponentDidMount(() => {
    if (handleMeasurement && bulkActionButton.current) {
      const width = bulkActionButton.current.getBoundingClientRect().width;
      handleMeasurement(width);
    }
  });
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: BulkActions['default'].BulkActionButton,
    ref: bulkActionButton
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    external: external,
    url: url,
    "aria-label": accessibilityLabel,
    onClick: onAction,
    disabled: disabled,
    disclosure: disclosure
  }, content), indicator && /*#__PURE__*/React__default['default'].createElement(Indicator.Indicator, null));
}

exports.BulkActionButton = BulkActionButton;
