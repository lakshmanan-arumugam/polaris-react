'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactTransitionGroup = require('react-transition-group');
var focus = require('../../utilities/focus.js');
var hooks = require('../../utilities/unique-id/hooks.js');
var withinContentContext = require('../../utilities/within-content-context.js');
var components = require('../../utilities/components.js');
var Modal$1 = require('./Modal.scss.js');
var Dialog = require('./components/Dialog/Dialog.js');
var Header = require('./components/Header/Header.js');
var Section = require('./components/Section/Section.js');
var Footer = require('./components/Footer/Footer.js');
var hooks$1 = require('../../utilities/i18n/hooks.js');
var Spinner = require('../Spinner/Spinner.js');
var Scrollable = require('../Scrollable/Scrollable.js');
var Portal = require('../Portal/Portal.js');
var Backdrop = require('../Backdrop/Backdrop.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const IFRAME_LOADING_HEIGHT = 200;
const DEFAULT_IFRAME_CONTENT_HEIGHT = 400;
const Modal = function Modal({
  children,
  title,
  titleHidden = false,
  src,
  iFrameName,
  open,
  instant,
  sectioned,
  loading,
  large,
  small,
  limitHeight,
  footer,
  primaryAction,
  secondaryActions,
  onScrolledToBottom,
  activator,
  onClose,
  onIFrameLoad,
  onTransitionEnd,
  noScroll
}) {
  const [iframeHeight, setIframeHeight] = React.useState(IFRAME_LOADING_HEIGHT);
  const headerId = hooks.useUniqueId('modal-header');
  const activatorRef = React.useRef(null);
  const i18n = hooks$1.useI18n();
  const iframeTitle = i18n.translate('Polaris.Modal.iFrameTitle');
  let dialog;
  let backdrop;
  const handleEntered = React.useCallback(() => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  }, [onTransitionEnd]);
  const handleExited = React.useCallback(() => {
    setIframeHeight(IFRAME_LOADING_HEIGHT);
    const activatorElement = activator && isRef(activator) ? activator && activator.current : activatorRef.current;

    if (activatorElement) {
      requestAnimationFrame(() => focus.focusFirstFocusableNode(activatorElement));
    }
  }, [activator]);
  const handleIFrameLoad = React.useCallback(evt => {
    const iframe = evt.target;

    if (iframe && iframe.contentWindow) {
      try {
        setIframeHeight(iframe.contentWindow.document.body.scrollHeight);
      } catch (_error) {
        setIframeHeight(DEFAULT_IFRAME_CONTENT_HEIGHT);
      }
    }

    if (onIFrameLoad != null) {
      onIFrameLoad(evt);
    }
  }, [onIFrameLoad]);

  if (open) {
    const footerMarkup = !footer && !primaryAction && !secondaryActions ? null : /*#__PURE__*/React__default['default'].createElement(Footer.Footer, {
      primaryAction: primaryAction,
      secondaryActions: secondaryActions
    }, footer);
    const content = sectioned ? components.wrapWithComponent(children, Section.Section, {}) : children;
    const body = loading ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: Modal$1['default'].Spinner
    }, /*#__PURE__*/React__default['default'].createElement(Spinner.Spinner, null)) : content;
    const scrollContainerMarkup = noScroll ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: Modal$1['default'].Body
    }, body) : /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable, {
      shadow: true,
      className: Modal$1['default'].Body,
      onScrolledToBottom: onScrolledToBottom
    }, body);
    const bodyMarkup = src ? /*#__PURE__*/React__default['default'].createElement("iframe", {
      name: iFrameName,
      title: iframeTitle,
      src: src,
      className: Modal$1['default'].IFrame,
      onLoad: handleIFrameLoad,
      style: {
        height: `${iframeHeight}px`
      }
    }) : scrollContainerMarkup;
    dialog = /*#__PURE__*/React__default['default'].createElement(Dialog.Dialog, {
      instant: instant,
      labelledBy: headerId,
      onClose: onClose,
      onEntered: handleEntered,
      onExited: handleExited,
      large: large,
      small: small,
      limitHeight: limitHeight
    }, /*#__PURE__*/React__default['default'].createElement(Header.Header, {
      titleHidden: titleHidden,
      id: headerId,
      onClose: onClose
    }, title), /*#__PURE__*/React__default['default'].createElement("div", {
      className: Modal$1['default'].BodyWrapper
    }, bodyMarkup), footerMarkup);
    backdrop = /*#__PURE__*/React__default['default'].createElement(Backdrop.Backdrop, null);
  }

  const animated = !instant;
  const activatorMarkup = activator && !isRef(activator) ? /*#__PURE__*/React__default['default'].createElement("div", {
    ref: activatorRef
  }, activator) : null;
  return /*#__PURE__*/React__default['default'].createElement(withinContentContext.WithinContentContext.Provider, {
    value: true
  }, activatorMarkup, /*#__PURE__*/React__default['default'].createElement(Portal.Portal, {
    idPrefix: "modal"
  }, /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.TransitionGroup, {
    appear: animated,
    enter: animated,
    exit: animated
  }, dialog), backdrop));
};

function isRef(ref) {
  return Object.prototype.hasOwnProperty.call(ref, 'current');
}

Modal.Section = Section.Section;

exports.Modal = Modal;
