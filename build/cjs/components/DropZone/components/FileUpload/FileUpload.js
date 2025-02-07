'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var capitalize = require('../../../../utilities/capitalize.js');
var context = require('../../context.js');
var index = require('../../utils/index.js');
var FileUpload$1 = require('./FileUpload.scss.js');
var uploadArrow = require('../../images/upload-arrow.svg.js');
var Caption = require('../../../Caption/Caption.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var Stack = require('../../../Stack/Stack.js');
var TextStyle = require('../../../TextStyle/TextStyle.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function FileUpload(props) {
  const i18n = hooks.useI18n();
  const {
    size,
    measuring,
    type,
    disabled,
    allowMultiple
  } = React.useContext(context.DropZoneContext);
  const typeSuffix = capitalize.capitalize(type);
  const allowMultipleKey = index.createAllowMultipleKey(allowMultiple);
  const {
    actionTitle = i18n.translate(`Polaris.DropZone.${allowMultipleKey}.actionTitle${typeSuffix}`),
    actionHint
  } = props;
  const actionClassNames = css.classNames(FileUpload$1['default'].Action, disabled && FileUpload$1['default'].disabled);
  const actionMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: actionClassNames
  }, actionTitle);
  const fileUploadClassName = css.classNames(FileUpload$1['default'].FileUpload, measuring && FileUpload$1['default'].measuring, size === 'large' && FileUpload$1['default'].large, size === 'small' && FileUpload$1['default'].small);
  const actionHintMarkup = actionHint && /*#__PURE__*/React__default['default'].createElement(Caption.Caption, null, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, actionHint));
  let viewMarkup;

  switch (size) {
    case 'large':
      viewMarkup = /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
        vertical: true,
        spacing: "tight"
      }, actionMarkup, actionHintMarkup);
      break;

    case 'medium':
      viewMarkup = /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
        vertical: true,
        spacing: "tight"
      }, actionMarkup, actionHintMarkup);
      break;

    case 'small':
      viewMarkup = /*#__PURE__*/React__default['default'].createElement("img", {
        width: "20",
        src: uploadArrow['default'],
        alt: ""
      });
      break;
  }

  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: fileUploadClassName
  }, viewMarkup);
}

exports.FileUpload = FileUpload;
