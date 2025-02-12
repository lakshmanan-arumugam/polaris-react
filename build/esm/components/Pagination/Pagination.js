import { ChevronLeftMinor, ChevronRightMinor } from '@shopify/polaris-icons';
import React, { createRef } from 'react';
import { isInputFocused } from '../../utilities/is-input-focused.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { KeypressListener } from '../KeypressListener/KeypressListener.js';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.js';
import { Button } from '../Button/Button.js';
import { TextStyle } from '../TextStyle/TextStyle.js';

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
  const i18n = useI18n();
  const node = /*#__PURE__*/createRef();
  const navLabel = accessibilityLabel || i18n.translate('Polaris.Pagination.pagination');
  const previousLabel = (accessibilityLabels === null || accessibilityLabels === void 0 ? void 0 : accessibilityLabels.previous) || i18n.translate('Polaris.Pagination.previous');
  const nextLabel = (accessibilityLabels === null || accessibilityLabels === void 0 ? void 0 : accessibilityLabels.next) || i18n.translate('Polaris.Pagination.next');
  const prev = /*#__PURE__*/React.createElement(Button, {
    outline: true,
    icon: ChevronLeftMinor,
    accessibilityLabel: previousLabel,
    url: previousURL,
    onClick: onPrevious,
    disabled: !hasPrevious,
    id: "previousURL"
  });
  const constructedPrevious = previousTooltip && hasPrevious ? /*#__PURE__*/React.createElement(Tooltip, {
    activatorWrapper: "span",
    content: previousTooltip
  }, prev) : prev;
  const next = /*#__PURE__*/React.createElement(Button, {
    outline: true,
    icon: ChevronRightMinor,
    accessibilityLabel: nextLabel,
    url: nextURL,
    onClick: onNext,
    disabled: !hasNext,
    id: "nextURL"
  });
  const constructedNext = nextTooltip && hasNext ? /*#__PURE__*/React.createElement(Tooltip, {
    activatorWrapper: "span",
    content: nextTooltip
  }, next) : next;
  const previousHandler = onPrevious || noop;
  const previousButtonEvents = previousKeys && (previousURL || onPrevious) && hasPrevious && previousKeys.map(key => /*#__PURE__*/React.createElement(KeypressListener, {
    key: key,
    keyCode: key,
    handler: previousURL ? handleCallback(clickPaginationLink('previousURL', node)) : handleCallback(previousHandler)
  }));
  const nextHandler = onNext || noop;
  const nextButtonEvents = nextKeys && (nextURL || onNext) && hasNext && nextKeys.map(key => /*#__PURE__*/React.createElement(KeypressListener, {
    key: key,
    keyCode: key,
    handler: nextURL ? handleCallback(clickPaginationLink('nextURL', node)) : handleCallback(nextHandler)
  }));
  const labelTextMarkup = hasNext && hasPrevious ? /*#__PURE__*/React.createElement(TextStyle, null, label) : /*#__PURE__*/React.createElement(TextStyle, {
    variation: "subdued"
  }, label);
  const labelMarkup = label ? /*#__PURE__*/React.createElement("div", {
    "aria-live": "polite"
  }, labelTextMarkup) : null;
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": navLabel,
    ref: node
  }, previousButtonEvents, nextButtonEvents, /*#__PURE__*/React.createElement(ButtonGroup, {
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
    if (isInputFocused()) {
      return;
    }

    fn();
  };
}

function noop() {}

export { Pagination };
