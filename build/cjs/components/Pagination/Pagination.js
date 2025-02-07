'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var polarisIcons = require('@shopify/polaris-icons');
var React = require('react');
var isInputFocused = require('../../utilities/is-input-focused.js');
var Tooltip = require('../Tooltip/Tooltip.js');
var hooks = require('../../utilities/i18n/hooks.js');
var KeypressListener = require('../KeypressListener/KeypressListener.js');
var ButtonGroup = require('../ButtonGroup/ButtonGroup.js');
var Button = require('../Button/Button.js');
var TextStyle = require('../TextStyle/TextStyle.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Pagination({
  hasNext,
  hasPrevious,
  nextURL,
  previousURL,
  onNext,
  onPrevious,
  nextTooltip,
  previousTooltip,
  nextKeys,
  previousKeys,
  accessibilityLabel,
  accessibilityLabels,
  label
}) {
  const i18n = hooks.useI18n();
  const node = /*#__PURE__*/React.createRef();
  const navLabel = accessibilityLabel || i18n.translate('Polaris.Pagination.pagination');
  const previousLabel = (accessibilityLabels === null || accessibilityLabels === void 0 ? void 0 : accessibilityLabels.previous) || i18n.translate('Polaris.Pagination.previous');
  const nextLabel = (accessibilityLabels === null || accessibilityLabels === void 0 ? void 0 : accessibilityLabels.next) || i18n.translate('Polaris.Pagination.next');
  const prev = /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    outline: true,
    icon: polarisIcons.ChevronLeftMinor,
    accessibilityLabel: previousLabel,
    url: previousURL,
    onClick: onPrevious,
    disabled: !hasPrevious,
    id: "previousURL"
  });
  const constructedPrevious = previousTooltip && hasPrevious ? /*#__PURE__*/React__default['default'].createElement(Tooltip.Tooltip, {
    activatorWrapper: "span",
    content: previousTooltip
  }, prev) : prev;
  const next = /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    outline: true,
    icon: polarisIcons.ChevronRightMinor,
    accessibilityLabel: nextLabel,
    url: nextURL,
    onClick: onNext,
    disabled: !hasNext,
    id: "nextURL"
  });
  const constructedNext = nextTooltip && hasNext ? /*#__PURE__*/React__default['default'].createElement(Tooltip.Tooltip, {
    activatorWrapper: "span",
    content: nextTooltip
  }, next) : next;
  const previousHandler = onPrevious || noop;
  const previousButtonEvents = previousKeys && (previousURL || onPrevious) && hasPrevious && previousKeys.map(key => /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
    key: key,
    keyCode: key,
    handler: previousURL ? handleCallback(clickPaginationLink('previousURL', node)) : handleCallback(previousHandler)
  }));
  const nextHandler = onNext || noop;
  const nextButtonEvents = nextKeys && (nextURL || onNext) && hasNext && nextKeys.map(key => /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
    key: key,
    keyCode: key,
    handler: nextURL ? handleCallback(clickPaginationLink('nextURL', node)) : handleCallback(nextHandler)
  }));
  const labelTextMarkup = hasNext && hasPrevious ? /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, null, label) : /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, label);
  const labelMarkup = label ? /*#__PURE__*/React__default['default'].createElement("div", {
    "aria-live": "polite"
  }, labelTextMarkup) : null;
  return /*#__PURE__*/React__default['default'].createElement("nav", {
    "aria-label": navLabel,
    ref: node
  }, previousButtonEvents, nextButtonEvents, /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, {
    segmented: !label
  }, constructedPrevious, labelMarkup, constructedNext));
}

function clickPaginationLink(id, node) {
  return () => {
    if (node.current == null) {
      return;
    }

    const link = node.current.querySelector(`#${id}`);

    if (link) {
      link.click();
    }
  };
}

function handleCallback(fn) {
  return () => {
    if (isInputFocused.isInputFocused()) {
      return;
    }

    fn();
  };
}

function noop() {}

exports.Pagination = Pagination;
