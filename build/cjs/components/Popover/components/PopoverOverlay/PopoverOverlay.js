'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisTokens = require('@shopify/polaris-tokens');
var focus = require('../../../../utilities/focus.js');
var css = require('../../../../utilities/css.js');
var components = require('../../../../utilities/components.js');
var types = require('../../../../types.js');
var shared = require('../../../shared.js');
var Popover = require('../../Popover.scss.js');
var KeypressListener = require('../../../KeypressListener/KeypressListener.js');
var PositionedOverlay = require('../../../PositionedOverlay/PositionedOverlay.js');
var Pane = require('../Pane/Pane.js');
var EventListener = require('../../../EventListener/EventListener.js');
var ThemeProvider = require('../../../ThemeProvider/ThemeProvider.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

exports.PopoverCloseSource = void 0;

(function (PopoverCloseSource) {
  PopoverCloseSource[PopoverCloseSource["Click"] = 0] = "Click";
  PopoverCloseSource[PopoverCloseSource["EscapeKeypress"] = 1] = "EscapeKeypress";
  PopoverCloseSource[PopoverCloseSource["FocusOut"] = 2] = "FocusOut";
  PopoverCloseSource[PopoverCloseSource["ScrollOut"] = 3] = "ScrollOut";
})(exports.PopoverCloseSource || (exports.PopoverCloseSource = {}));

var TransitionStatus;

(function (TransitionStatus) {
  TransitionStatus["Entering"] = "entering";
  TransitionStatus["Entered"] = "entered";
  TransitionStatus["Exiting"] = "exiting";
  TransitionStatus["Exited"] = "exited";
})(TransitionStatus || (TransitionStatus = {}));

class PopoverOverlay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transitionStatus: this.props.active ? TransitionStatus.Entering : TransitionStatus.Exited
    };
    this.contentNode = /*#__PURE__*/React.createRef();
    this.enteringTimer = void 0;
    this.exitingTimer = void 0;
    this.overlayRef = void 0;

    this.renderPopover = overlayDetails => {
      const {
        measuring,
        desiredHeight,
        positioning
      } = overlayDetails;
      const {
        id,
        children,
        sectioned,
        fullWidth,
        fullHeight,
        fluidContent,
        hideOnPrint,
        colorScheme,
        autofocusTarget
      } = this.props;
      const className = css.classNames(Popover['default'].Popover, positioning === 'above' && Popover['default'].positionedAbove, fullWidth && Popover['default'].fullWidth, measuring && Popover['default'].measuring, hideOnPrint && Popover['default']['PopoverOverlay-hideOnPrint']);
      const contentStyles = measuring ? undefined : {
        height: desiredHeight
      };
      const contentClassNames = css.classNames(Popover['default'].Content, fullHeight && Popover['default']['Content-fullHeight'], fluidContent && Popover['default']['Content-fluidContent']);
      const content = /*#__PURE__*/React__default['default'].createElement("div", {
        id: id,
        tabIndex: autofocusTarget === 'none' ? undefined : -1,
        className: contentClassNames,
        style: contentStyles,
        ref: this.contentNode
      }, renderPopoverContent(children, {
        sectioned
      }));
      return /*#__PURE__*/React__default['default'].createElement("div", Object.assign({
        className: className
      }, shared.overlay.props), /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
        event: "click",
        handler: this.handleClick
      }), /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
        event: "touchstart",
        handler: this.handleClick
      }), /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
        keyCode: types.Key.Escape,
        handler: this.handleEscape
      }), /*#__PURE__*/React__default['default'].createElement("div", {
        className: Popover['default'].FocusTracker // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: 0,
        onFocus: this.handleFocusFirstItem
      }), /*#__PURE__*/React__default['default'].createElement(ThemeProvider.ThemeProvider, {
        alwaysRenderCustomProperties: true,
        theme: {
          colorScheme
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: Popover['default'].Wrapper
      }, content)), /*#__PURE__*/React__default['default'].createElement("div", {
        className: Popover['default'].FocusTracker // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: 0,
        onFocus: this.handleFocusLastItem
      }));
    };

    this.handleClick = event => {
      const target = event.target;
      const {
        contentNode,
        props: {
          activator,
          onClose
        }
      } = this;
      const isDescendant = contentNode.current != null && nodeContainsDescendant(contentNode.current, target);
      const isActivatorDescendant = nodeContainsDescendant(activator, target);

      if (isDescendant || isActivatorDescendant || this.state.transitionStatus !== TransitionStatus.Entered) {
        return;
      }

      onClose(exports.PopoverCloseSource.Click);
    };

    this.handleScrollOut = () => {
      this.props.onClose(exports.PopoverCloseSource.ScrollOut);
    };

    this.handleEscape = () => {
      this.props.onClose(exports.PopoverCloseSource.EscapeKeypress);
    };

    this.handleFocusFirstItem = () => {
      this.props.onClose(exports.PopoverCloseSource.FocusOut);
    };

    this.handleFocusLastItem = () => {
      this.props.onClose(exports.PopoverCloseSource.FocusOut);
    };

    this.overlayRef = /*#__PURE__*/React.createRef();
  }

  forceUpdatePosition() {
    var _this$overlayRef$curr;

    (_this$overlayRef$curr = this.overlayRef.current) === null || _this$overlayRef$curr === void 0 ? void 0 : _this$overlayRef$curr.forceUpdatePosition();
  }

  changeTransitionStatus(transitionStatus, cb) {
    this.setState({
      transitionStatus
    }, cb); // Forcing a reflow to enable the animation

    this.contentNode.current && this.contentNode.current.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.props.active) {
      this.focusContent();
      this.changeTransitionStatus(TransitionStatus.Entered);
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.active && !oldProps.active) {
      this.focusContent();
      this.changeTransitionStatus(TransitionStatus.Entering, () => {
        this.clearTransitionTimeout();
        this.enteringTimer = window.setTimeout(() => {
          this.setState({
            transitionStatus: TransitionStatus.Entered
          });
        }, polarisTokens.durationFast);
      });
    }

    if (!this.props.active && oldProps.active) {
      this.changeTransitionStatus(TransitionStatus.Exiting, () => {
        this.clearTransitionTimeout();
        this.exitingTimer = window.setTimeout(() => {
          this.setState({
            transitionStatus: TransitionStatus.Exited
          });
        }, polarisTokens.durationFast);
      });
    }
  }

  componentWillUnmount() {
    this.clearTransitionTimeout();
  }

  render() {
    const {
      active,
      activator,
      fullWidth,
      preferredPosition = 'below',
      preferredAlignment = 'center',
      preferInputActivator = true,
      fixed,
      zIndexOverride
    } = this.props;
    const {
      transitionStatus
    } = this.state;
    if (transitionStatus === TransitionStatus.Exited && !active) return null;
    const className = css.classNames(Popover['default'].PopoverOverlay, transitionStatus === TransitionStatus.Entering && Popover['default']['PopoverOverlay-entering'], transitionStatus === TransitionStatus.Entered && Popover['default']['PopoverOverlay-open'], transitionStatus === TransitionStatus.Exiting && Popover['default']['PopoverOverlay-exiting']);
    return /*#__PURE__*/React__default['default'].createElement(PositionedOverlay.PositionedOverlay, {
      ref: this.overlayRef,
      fullWidth: fullWidth,
      active: active,
      activator: activator,
      preferInputActivator: preferInputActivator,
      preferredPosition: preferredPosition,
      preferredAlignment: preferredAlignment,
      render: this.renderPopover.bind(this),
      fixed: fixed,
      onScrollOut: this.handleScrollOut,
      classNames: className,
      zIndexOverride: zIndexOverride
    });
  }

  clearTransitionTimeout() {
    if (this.enteringTimer) {
      window.clearTimeout(this.enteringTimer);
    }

    if (this.exitingTimer) {
      window.clearTimeout(this.exitingTimer);
    }
  }

  focusContent() {
    const {
      autofocusTarget = 'container'
    } = this.props;

    if (autofocusTarget === 'none' || this.contentNode == null) {
      return;
    }

    requestAnimationFrame(() => {
      if (this.contentNode.current == null) {
        return;
      }

      const focusableChild = focus.findFirstFocusableNode(this.contentNode.current);

      if (focusableChild && autofocusTarget === 'first-node') {
        focusableChild.focus({
          preventScroll: process.env.NODE_ENV === 'development'
        });
      } else {
        this.contentNode.current.focus({
          preventScroll: process.env.NODE_ENV === 'development'
        });
      }
    });
  } // eslint-disable-next-line @shopify/react-no-multiple-render-methods


}

function renderPopoverContent(children, props) {
  const childrenArray = React.Children.toArray(children);

  if (components.isElementOfType(childrenArray[0], Pane.Pane)) {
    return childrenArray;
  }

  return components.wrapWithComponent(childrenArray, Pane.Pane, props);
}

function nodeContainsDescendant(rootNode, descendant) {
  if (rootNode === descendant) {
    return true;
  }

  let parent = descendant.parentNode;

  while (parent != null) {
    if (parent === rootNode) {
      return true;
    }

    parent = parent.parentNode;
  }

  return false;
}

exports.PopoverOverlay = PopoverOverlay;
exports.nodeContainsDescendant = nodeContainsDescendant;
