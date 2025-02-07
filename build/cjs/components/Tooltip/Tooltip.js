'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var focus = require('../../utilities/focus.js');
var useToggle = require('../../utilities/use-toggle.js');
var types = require('../../types.js');
var TooltipOverlay = require('./components/TooltipOverlay/TooltipOverlay.js');
var hooks = require('../../utilities/unique-id/hooks.js');
var Portal = require('../Portal/Portal.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Tooltip({
  children,
  content,
  dismissOnMouseOut,
  active: originalActive,
  preferredPosition = 'below',
  activatorWrapper = 'span',
  accessibilityLabel
}) {
  const WrapperComponent = activatorWrapper;
  const {
    value: active,
    setTrue: handleFocus,
    setFalse: handleBlur
  } = useToggle.useToggle(Boolean(originalActive));
  const [activatorNode, setActivatorNode] = React.useState(null);
  const id = hooks.useUniqueId('TooltipContent');
  const activatorContainer = React.useRef(null);
  const mouseEntered = React.useRef(false);
  React.useEffect(() => {
    const firstFocusable = activatorContainer.current ? focus.findFirstFocusableNode(activatorContainer.current) : null;
    const accessibilityNode = firstFocusable || activatorContainer.current;
    if (!accessibilityNode) return;
    accessibilityNode.tabIndex = 0;
    accessibilityNode.setAttribute('aria-describedby', id);
    accessibilityNode.setAttribute('data-polaris-tooltip-activator', 'true');
  }, [id, children]);
  const handleKeyUp = React.useCallback(event => {
    if (event.keyCode !== types.Key.Escape) return;
    handleBlur();
  }, [handleBlur]);
  const portal = activatorNode ? /*#__PURE__*/React__default['default'].createElement(Portal.Portal, {
    idPrefix: "tooltip"
  }, /*#__PURE__*/React__default['default'].createElement(TooltipOverlay.TooltipOverlay, {
    id: id,
    preferredPosition: preferredPosition,
    activator: activatorNode,
    active: active,
    accessibilityLabel: accessibilityLabel,
    onClose: noop,
    preventInteraction: dismissOnMouseOut
  }, content)) : null;
  return /*#__PURE__*/React__default['default'].createElement(WrapperComponent, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseLeave: handleMouseLeave,
    onMouseOver: handleMouseEnterFix,
    onClick: stopPropagation,
    ref: setActivator,
    onKeyUp: handleKeyUp
  }, children, portal);

  function setActivator(node) {
    const activatorContainerRef = activatorContainer;

    if (node == null) {
      activatorContainerRef.current = null;
      setActivatorNode(null);
      return;
    }

    node.firstElementChild instanceof HTMLElement && setActivatorNode(node.firstElementChild);
    activatorContainerRef.current = node;
  }

  function handleMouseEnter() {
    mouseEntered.current = true;
    handleFocus();
  }

  function handleMouseLeave() {
    mouseEntered.current = false;
    handleBlur();
  } // https://github.com/facebook/react/issues/10109
  // Mouseenter event not triggered when cursor moves from disabled button


  function handleMouseEnterFix() {
    !mouseEntered.current && handleMouseEnter();
  }
}

function noop() {}

function stopPropagation(event) {
  event.stopPropagation();
}

exports.Tooltip = Tooltip;
