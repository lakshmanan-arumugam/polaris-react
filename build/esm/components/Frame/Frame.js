import React, { PureComponent, createRef } from 'react';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import { durationSlow } from '@shopify/polaris-tokens';
import { CSSTransition } from 'react-transition-group';
import { classNames } from '../../utilities/css.js';
import { layer, dataPolarisTopBar } from '../shared.js';
import { setRootProperty } from '../../utilities/set-root-property.js';
import styles from './Frame.scss.js';
import { Loading } from './components/Loading/Loading.js';
import { CSSAnimation } from './components/CSSAnimation/CSSAnimation.js';
import { ContextualSaveBar } from './components/ContextualSaveBar/ContextualSaveBar.js';
import { FrameContext } from '../../utilities/frame/context.js';
import { ToastManager } from './components/ToastManager/ToastManager.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { useMediaQuery } from '../../utilities/media-query/hooks.js';
import { TrapFocus } from '../TrapFocus/TrapFocus.js';
import { Icon } from '../Icon/Icon.js';
import { Backdrop } from '../Backdrop/Backdrop.js';
import { EventListener } from '../EventListener/EventListener.js';

const GLOBAL_RIBBON_CUSTOM_PROPERTY = '--global-ribbon-height';
const APP_FRAME_MAIN = 'AppFrameMain';
const APP_FRAME_NAV = 'AppFrameNav';
const APP_FRAME_TOP_BAR = 'AppFrameTopBar';
const APP_FRAME_LOADING_BAR = 'AppFrameLoadingBar';

class FrameInner extends PureComponent {
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
    this.navigationNode = /*#__PURE__*/createRef();

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
      setRootProperty(GLOBAL_RIBBON_CUSTOM_PROPERTY, `${globalRibbonHeight}px`, null);
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
    const navClassName = classNames(styles.Navigation, showMobileNavigation && styles['Navigation-visible']);
    const mobileNavHidden = isNavigationCollapsed && !showMobileNavigation;
    const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;
    const tabIndex = mobileNavShowing ? 0 : -1;
    const mobileNavAttributes = { ...(mobileNavShowing && {
        'aria-modal': true,
        role: 'dialog'
      })
    };
    const navigationMarkup = navigation ? /*#__PURE__*/React.createElement(TrapFocus, {
      trapping: mobileNavShowing
    }, /*#__PURE__*/React.createElement(CSSTransition, {
      nodeRef: this.navigationNode,
      appear: isNavigationCollapsed,
      exit: isNavigationCollapsed,
      in: showMobileNavigation,
      timeout: durationSlow,
      classNames: navTransitionClasses
    }, /*#__PURE__*/React.createElement("div", Object.assign({
      key: "NavContent"
    }, mobileNavAttributes, {
      "aria-label": i18n.translate('Polaris.Frame.navigationLabel'),
      ref: this.navigationNode,
      className: navClassName,
      onKeyDown: this.handleNavKeydown,
      id: APP_FRAME_NAV,
      hidden: mobileNavHidden
    }), navigation, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: styles.NavigationDismiss,
      onClick: this.handleNavigationDismiss,
      "aria-hidden": mobileNavHidden || !isNavigationCollapsed && !showMobileNavigation,
      "aria-label": i18n.translate('Polaris.Frame.Navigation.closeMobileNavigationLabel'),
      tabIndex: tabIndex
    }, /*#__PURE__*/React.createElement(Icon, {
      source: MobileCancelMajor
    }))))) : null;
    const loadingMarkup = loadingStack > 0 ? /*#__PURE__*/React.createElement("div", {
      className: styles.LoadingBar,
      id: APP_FRAME_LOADING_BAR
    }, /*#__PURE__*/React.createElement(Loading, null)) : null;
    const contextualSaveBarMarkup = /*#__PURE__*/React.createElement(CSSAnimation, {
      in: showContextualSaveBar,
      className: styles.ContextualSaveBar,
      type: "fade"
    }, /*#__PURE__*/React.createElement(ContextualSaveBar, this.contextualSaveBar));
    const topBarMarkup = topBar ? /*#__PURE__*/React.createElement("div", Object.assign({
      className: styles.TopBar
    }, layer.props, dataPolarisTopBar.props, {
      id: APP_FRAME_TOP_BAR
    }), topBar) : null;
    const globalRibbonMarkup = globalRibbon ? /*#__PURE__*/React.createElement("div", {
      className: styles.GlobalRibbonContainer,
      ref: this.setGlobalRibbonContainer
    }, globalRibbon) : null;
    const skipClassName = classNames(styles.Skip, skipFocused && styles.focused);
    const skipTarget = skipToContentTarget !== null && skipToContentTarget !== void 0 && skipToContentTarget.current ? skipToContentTarget.current.id : APP_FRAME_MAIN;
    const skipMarkup = /*#__PURE__*/React.createElement("div", {
      className: skipClassName
    }, /*#__PURE__*/React.createElement("a", {
      href: `#${skipTarget}`,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onClick: this.handleClick
    }, i18n.translate('Polaris.Frame.skipToContent')));
    const navigationAttributes = navigation ? {
      'data-has-navigation': true
    } : {};
    const frameClassName = classNames(styles.Frame, navigation && styles.hasNav, topBar && styles.hasTopBar);
    const navigationOverlayMarkup = showMobileNavigation && isNavigationCollapsed ? /*#__PURE__*/React.createElement(Backdrop, {
      belowNavigation: true,
      onClick: this.handleNavigationDismiss,
      onTouchStart: this.handleNavigationDismiss
    }) : null; // This is probably a legit error but I don't have the time to refactor this
    // eslint-disable-next-line react/jsx-no-constructed-context-values

    const context = {
      showToast: this.showToast,
      hideToast: this.hideToast,
      startLoading: this.startLoading,
      stopLoading: this.stopLoading,
      setContextualSaveBar: this.setContextualSaveBar,
      removeContextualSaveBar: this.removeContextualSaveBar
    };
    return /*#__PURE__*/React.createElement(FrameContext.Provider, {
      value: context
    }, /*#__PURE__*/React.createElement("div", Object.assign({
      className: frameClassName
    }, layer.props, navigationAttributes), skipMarkup, topBarMarkup, navigationMarkup, contextualSaveBarMarkup, loadingMarkup, navigationOverlayMarkup, /*#__PURE__*/React.createElement("main", {
      className: styles.Main,
      id: APP_FRAME_MAIN,
      "data-has-global-ribbon": Boolean(globalRibbon)
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.Content
    }, children)), /*#__PURE__*/React.createElement(ToastManager, {
      toastMessages: toastMessages
    }), globalRibbonMarkup, /*#__PURE__*/React.createElement(EventListener, {
      event: "resize",
      handler: this.handleResize
    })));
  }

}

const navTransitionClasses = {
  enter: classNames(styles['Navigation-enter']),
  enterActive: classNames(styles['Navigation-enterActive']),
  enterDone: classNames(styles['Navigation-enterActive']),
  exit: classNames(styles['Navigation-exit']),
  exitActive: classNames(styles['Navigation-exitActive'])
};
function Frame(props) {
  const i18n = useI18n();
  const mediaQuery = useMediaQuery();
  return /*#__PURE__*/React.createElement(FrameInner, Object.assign({}, props, {
    i18n: i18n,
    mediaQuery: mediaQuery
  }));
}

export { Frame };
