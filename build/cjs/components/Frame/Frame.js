'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var polarisTokens = require('@shopify/polaris-tokens');
var reactTransitionGroup = require('react-transition-group');
var css = require('../../utilities/css.js');
var shared = require('../shared.js');
var setRootProperty = require('../../utilities/set-root-property.js');
var Frame$1 = require('./Frame.scss.js');
var Loading = require('./components/Loading/Loading.js');
var CSSAnimation = require('./components/CSSAnimation/CSSAnimation.js');
var ContextualSaveBar = require('./components/ContextualSaveBar/ContextualSaveBar.js');
var context = require('../../utilities/frame/context.js');
var ToastManager = require('./components/ToastManager/ToastManager.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/media-query/hooks.js');
var TrapFocus = require('../TrapFocus/TrapFocus.js');
var Icon = require('../Icon/Icon.js');
var Backdrop = require('../Backdrop/Backdrop.js');
var EventListener = require('../EventListener/EventListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const GLOBAL_RIBBON_CUSTOM_PROPERTY = '--global-ribbon-height';
const APP_FRAME_MAIN = 'AppFrameMain';
const APP_FRAME_NAV = 'AppFrameNav';
const APP_FRAME_TOP_BAR = 'AppFrameTopBar';
const APP_FRAME_LOADING_BAR = 'AppFrameLoadingBar';

class FrameInner extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      skipFocused: false,
      globalRibbonHeight: 0,
      loadingStack: 0,
      toastMessages: [],
      showContextualSaveBar: false
    };
    this.contextualSaveBar = null;
    this.globalRibbonContainer = null;
    this.navigationNode = /*#__PURE__*/React.createRef();

    this.setGlobalRibbonHeight = () => {
      const {
        globalRibbonContainer
      } = this;

      if (globalRibbonContainer) {
        this.setState({
          globalRibbonHeight: globalRibbonContainer.offsetHeight
        }, this.setGlobalRibbonRootProperty);
      }
    };

    this.setGlobalRibbonRootProperty = () => {
      const {
        globalRibbonHeight
      } = this.state;
      setRootProperty.setRootProperty(GLOBAL_RIBBON_CUSTOM_PROPERTY, `${globalRibbonHeight}px`, null);
    };

    this.showToast = toast => {
      this.setState(({
        toastMessages
      }) => {
        const hasToastById = toastMessages.find(({
          id
        }) => id === toast.id) != null;
        return {
          toastMessages: hasToastById ? toastMessages : [...toastMessages, toast]
        };
      });
    };

    this.hideToast = ({
      id
    }) => {
      this.setState(({
        toastMessages
      }) => {
        return {
          toastMessages: toastMessages.filter(({
            id: toastId
          }) => id !== toastId)
        };
      });
    };

    this.setContextualSaveBar = props => {
      const {
        showContextualSaveBar
      } = this.state;
      this.contextualSaveBar = { ...props
      };

      if (showContextualSaveBar === true) {
        this.forceUpdate();
      } else {
        this.setState({
          showContextualSaveBar: true
        });
      }
    };

    this.removeContextualSaveBar = () => {
      this.contextualSaveBar = null;
      this.setState({
        showContextualSaveBar: false
      });
    };

    this.startLoading = () => {
      this.setState(({
        loadingStack
      }) => ({
        loadingStack: loadingStack + 1
      }));
    };

    this.stopLoading = () => {
      this.setState(({
        loadingStack
      }) => ({
        loadingStack: Math.max(0, loadingStack - 1)
      }));
    };

    this.handleResize = () => {
      if (this.props.globalRibbon) {
        this.setGlobalRibbonHeight();
      }
    };

    this.handleFocus = () => {
      this.setState({
        skipFocused: true
      });
    };

    this.handleBlur = () => {
      this.setState({
        skipFocused: false
      });
    };

    this.handleClick = event => {
      const {
        skipToContentTarget
      } = this.props;

      if (skipToContentTarget && skipToContentTarget.current) {
        skipToContentTarget.current.focus();
        event === null || event === void 0 ? void 0 : event.preventDefault();
      }
    };

    this.handleNavigationDismiss = () => {
      const {
        onNavigationDismiss
      } = this.props;

      if (onNavigationDismiss != null) {
        onNavigationDismiss();
      }
    };

    this.setGlobalRibbonContainer = node => {
      this.globalRibbonContainer = node;
    };

    this.handleNavKeydown = event => {
      const {
        key
      } = event;
      const {
        mediaQuery: {
          isNavigationCollapsed
        },
        showMobileNavigation
      } = this.props;
      const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;

      if (mobileNavShowing && key === 'Escape') {
        this.handleNavigationDismiss();
      }
    };
  }

  componentDidMount() {
    this.handleResize();

    if (this.props.globalRibbon) {
      return;
    }

    this.setGlobalRibbonRootProperty();
  }

  componentDidUpdate(prevProps) {
    if (this.props.globalRibbon !== prevProps.globalRibbon) {
      this.setGlobalRibbonHeight();
    }
  }

  render() {
    const {
      skipFocused,
      loadingStack,
      toastMessages,
      showContextualSaveBar
    } = this.state;
    const {
      children,
      navigation,
      topBar,
      globalRibbon,
      showMobileNavigation = false,
      skipToContentTarget,
      i18n,
      mediaQuery: {
        isNavigationCollapsed
      }
    } = this.props;
    const navClassName = css.classNames(Frame$1['default'].Navigation, showMobileNavigation && Frame$1['default']['Navigation-visible']);
    const mobileNavHidden = isNavigationCollapsed && !showMobileNavigation;
    const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;
    const tabIndex = mobileNavShowing ? 0 : -1;
    const mobileNavAttributes = { ...(mobileNavShowing && {
        'aria-modal': true,
        role: 'dialog'
      })
    };
    const navigationMarkup = navigation ? /*#__PURE__*/React__default['default'].createElement(TrapFocus.TrapFocus, {
      trapping: mobileNavShowing
    }, /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.CSSTransition, {
      nodeRef: this.navigationNode,
      appear: isNavigationCollapsed,
      exit: isNavigationCollapsed,
      in: showMobileNavigation,
      timeout: polarisTokens.durationSlow,
      classNames: navTransitionClasses
    }, /*#__PURE__*/React__default['default'].createElement("div", Object.assign({
      key: "NavContent"
    }, mobileNavAttributes, {
      "aria-label": i18n.translate('Polaris.Frame.navigationLabel'),
      ref: this.navigationNode,
      className: navClassName,
      onKeyDown: this.handleNavKeydown,
      id: APP_FRAME_NAV,
      hidden: mobileNavHidden
    }), navigation, /*#__PURE__*/React__default['default'].createElement("button", {
      type: "button",
      className: Frame$1['default'].NavigationDismiss,
      onClick: this.handleNavigationDismiss,
      "aria-hidden": mobileNavHidden || !isNavigationCollapsed && !showMobileNavigation,
      "aria-label": i18n.translate('Polaris.Frame.Navigation.closeMobileNavigationLabel'),
      tabIndex: tabIndex
    }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
      source: polarisIcons.MobileCancelMajor
    }))))) : null;
    const loadingMarkup = loadingStack > 0 ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: Frame$1['default'].LoadingBar,
      id: APP_FRAME_LOADING_BAR
    }, /*#__PURE__*/React__default['default'].createElement(Loading.Loading, null)) : null;
    const contextualSaveBarMarkup = /*#__PURE__*/React__default['default'].createElement(CSSAnimation.CSSAnimation, {
      in: showContextualSaveBar,
      className: Frame$1['default'].ContextualSaveBar,
      type: "fade"
    }, /*#__PURE__*/React__default['default'].createElement(ContextualSaveBar.ContextualSaveBar, this.contextualSaveBar));
    const topBarMarkup = topBar ? /*#__PURE__*/React__default['default'].createElement("div", Object.assign({
      className: Frame$1['default'].TopBar
    }, shared.layer.props, shared.dataPolarisTopBar.props, {
      id: APP_FRAME_TOP_BAR
    }), topBar) : null;
    const globalRibbonMarkup = globalRibbon ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: Frame$1['default'].GlobalRibbonContainer,
      ref: this.setGlobalRibbonContainer
    }, globalRibbon) : null;
    const skipClassName = css.classNames(Frame$1['default'].Skip, skipFocused && Frame$1['default'].focused);
    const skipTarget = skipToContentTarget !== null && skipToContentTarget !== void 0 && skipToContentTarget.current ? skipToContentTarget.current.id : APP_FRAME_MAIN;
    const skipMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: skipClassName
    }, /*#__PURE__*/React__default['default'].createElement("a", {
      href: `#${skipTarget}`,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onClick: this.handleClick
    }, i18n.translate('Polaris.Frame.skipToContent')));
    const navigationAttributes = navigation ? {
      'data-has-navigation': true
    } : {};
    const frameClassName = css.classNames(Frame$1['default'].Frame, navigation && Frame$1['default'].hasNav, topBar && Frame$1['default'].hasTopBar);
    const navigationOverlayMarkup = showMobileNavigation && isNavigationCollapsed ? /*#__PURE__*/React__default['default'].createElement(Backdrop.Backdrop, {
      belowNavigation: true,
      onClick: this.handleNavigationDismiss,
      onTouchStart: this.handleNavigationDismiss
    }) : null; // This is probably a legit error but I don't have the time to refactor this
    // eslint-disable-next-line react/jsx-no-constructed-context-values

    const context$1 = {
      showToast: this.showToast,
      hideToast: this.hideToast,
      startLoading: this.startLoading,
      stopLoading: this.stopLoading,
      setContextualSaveBar: this.setContextualSaveBar,
      removeContextualSaveBar: this.removeContextualSaveBar
    };
    return /*#__PURE__*/React__default['default'].createElement(context.FrameContext.Provider, {
      value: context$1
    }, /*#__PURE__*/React__default['default'].createElement("div", Object.assign({
      className: frameClassName
    }, shared.layer.props, navigationAttributes), skipMarkup, topBarMarkup, navigationMarkup, contextualSaveBarMarkup, loadingMarkup, navigationOverlayMarkup, /*#__PURE__*/React__default['default'].createElement("main", {
      className: Frame$1['default'].Main,
      id: APP_FRAME_MAIN,
      "data-has-global-ribbon": Boolean(globalRibbon)
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: Frame$1['default'].Content
    }, children)), /*#__PURE__*/React__default['default'].createElement(ToastManager.ToastManager, {
      toastMessages: toastMessages
    }), globalRibbonMarkup, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "resize",
      handler: this.handleResize
    })));
  }

}

const navTransitionClasses = {
  enter: css.classNames(Frame$1['default']['Navigation-enter']),
  enterActive: css.classNames(Frame$1['default']['Navigation-enterActive']),
  enterDone: css.classNames(Frame$1['default']['Navigation-enterActive']),
  exit: css.classNames(Frame$1['default']['Navigation-exit']),
  exitActive: css.classNames(Frame$1['default']['Navigation-exitActive'])
};
function Frame(props) {
  const i18n = hooks.useI18n();
  const mediaQuery = hooks$1.useMediaQuery();
  return /*#__PURE__*/React__default['default'].createElement(FrameInner, Object.assign({}, props, {
    i18n: i18n,
    mediaQuery: mediaQuery
  }));
}

exports.Frame = Frame;
