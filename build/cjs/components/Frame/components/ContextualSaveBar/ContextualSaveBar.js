'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var getWidth = require('../../../../utilities/get-width.js');
var useToggle = require('../../../../utilities/use-toggle.js');
var ContextualSaveBar$1 = require('./ContextualSaveBar.scss.js');
var hooks$1 = require('../../../../utilities/theme/hooks.js');
var DiscardConfirmationModal = require('./components/DiscardConfirmationModal/DiscardConfirmationModal.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var Button = require('../../../Button/Button.js');
var Image = require('../../../Image/Image.js');
var ThemeProvider = require('../../../ThemeProvider/ThemeProvider.js');
var Stack = require('../../../Stack/Stack.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ContextualSaveBar({
  alignContentFlush,
  message,
  saveAction,
  discardAction,
  fullWidth,
  contextControl
}) {
  const i18n = hooks.useI18n();
  const {
    logo
  } = hooks$1.useTheme();
  const {
    value: discardConfirmationModalVisible,
    toggle: toggleDiscardConfirmationModal,
    setFalse: closeDiscardConfirmationModal
  } = useToggle.useToggle(false);
  const handleDiscardAction = React.useCallback(() => {
    if (discardAction && discardAction.onAction) {
      discardAction.onAction();
    }

    closeDiscardConfirmationModal();
  }, [closeDiscardConfirmationModal, discardAction]);
  const discardActionContent = discardAction && discardAction.content ? discardAction.content : i18n.translate('Polaris.ContextualSaveBar.discard');
  let discardActionHandler;

  if (discardAction && discardAction.discardConfirmationModal) {
    discardActionHandler = toggleDiscardConfirmationModal;
  } else if (discardAction) {
    discardActionHandler = discardAction.onAction;
  }

  const discardConfirmationModalMarkup = discardAction && discardAction.onAction && discardAction.discardConfirmationModal && /*#__PURE__*/React__default['default'].createElement(DiscardConfirmationModal.DiscardConfirmationModal, {
    open: discardConfirmationModalVisible,
    onCancel: toggleDiscardConfirmationModal,
    onDiscard: handleDiscardAction
  });
  const discardActionMarkup = discardAction && /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    url: discardAction.url,
    onClick: discardActionHandler,
    loading: discardAction.loading,
    disabled: discardAction.disabled,
    accessibilityLabel: discardAction.content
  }, discardActionContent);
  const saveActionContent = saveAction && saveAction.content ? saveAction.content : i18n.translate('Polaris.ContextualSaveBar.save');
  const saveActionMarkup = saveAction && /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    primary: true,
    url: saveAction.url,
    onClick: saveAction.onAction,
    loading: saveAction.loading,
    disabled: saveAction.disabled,
    accessibilityLabel: saveAction.content
  }, saveActionContent);
  const width = getWidth.getWidth(logo, 104);
  const imageMarkup = logo && /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    style: {
      width
    },
    source: logo.contextualSaveBarSource || '',
    alt: ""
  });
  const logoMarkup = alignContentFlush || contextControl ? null : /*#__PURE__*/React__default['default'].createElement("div", {
    className: ContextualSaveBar$1['default'].LogoContainer,
    style: {
      width
    }
  }, imageMarkup);
  const contextControlMarkup = contextControl ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ContextualSaveBar$1['default'].ContextControl
  }, contextControl) : null;
  const contentsClassName = css.classNames(ContextualSaveBar$1['default'].Contents, fullWidth && ContextualSaveBar$1['default'].fullWidth);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(ThemeProvider.ThemeProvider, {
    theme: {
      colorScheme: 'inverse'
    }
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: ContextualSaveBar$1['default'].ContextualSaveBar
  }, contextControlMarkup, logoMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: contentsClassName
  }, /*#__PURE__*/React__default['default'].createElement("h2", {
    className: ContextualSaveBar$1['default'].Message
  }, message), /*#__PURE__*/React__default['default'].createElement("div", {
    className: ContextualSaveBar$1['default'].ActionContainer
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    spacing: "tight",
    wrap: false
  }, discardActionMarkup, saveActionMarkup))))), discardConfirmationModalMarkup);
}

exports.ContextualSaveBar = ContextualSaveBar;
