'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var bannerContext = require('../../utilities/banner-context.js');
var withinContentContext = require('../../utilities/within-content-context.js');
var Banner$1 = require('./Banner.scss.js');
var utils = require('../UnstyledButton/utils.js');
var hooks = require('../../utilities/unique-id/hooks.js');
var hooks$1 = require('../../utilities/i18n/hooks.js');
var Heading = require('../Heading/Heading.js');
var Spinner = require('../Spinner/Spinner.js');
var ButtonGroup = require('../ButtonGroup/ButtonGroup.js');
var Button = require('../Button/Button.js');
var Icon = require('../Icon/Icon.js');
var UnstyledLink = require('../UnstyledLink/UnstyledLink.js');
var UnstyledButton = require('../UnstyledButton/UnstyledButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const Banner = /*#__PURE__*/React.forwardRef(function Banner({
  icon,
  action,
  secondaryAction,
  title,
  children,
  status,
  onDismiss,
  stopAnnouncements
}, bannerRef) {
  const withinContentContainer = React.useContext(withinContentContext.WithinContentContext);
  const id = hooks.useUniqueId('Banner');
  const i18n = hooks$1.useI18n();
  const {
    wrapperRef,
    handleKeyUp,
    handleBlur,
    handleMouseUp,
    shouldShowFocus
  } = useBannerFocus(bannerRef);
  const {
    defaultIcon,
    iconColor,
    ariaRoleType
  } = useBannerAttributes(status);
  const iconName = icon || defaultIcon;
  const className = css.classNames(Banner$1['default'].Banner, status && Banner$1['default'][css.variationName('status', status)], onDismiss && Banner$1['default'].hasDismiss, shouldShowFocus && Banner$1['default'].keyFocused, withinContentContainer ? Banner$1['default'].withinContentContainer : Banner$1['default'].withinPage);
  let headingMarkup = null;
  let headingID;

  if (title) {
    headingID = `${id}Heading`;
    headingMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: Banner$1['default'].Heading,
      id: headingID
    }, /*#__PURE__*/React__default['default'].createElement(Heading.Heading, {
      element: "p"
    }, title));
  }

  const spinnerMarkup = action !== null && action !== void 0 && action.loading ? /*#__PURE__*/React__default['default'].createElement("button", {
    disabled: true,
    "aria-busy": true,
    className: css.classNames(Banner$1['default'].Button, Banner$1['default'].loading)
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Banner$1['default'].Spinner
  }, /*#__PURE__*/React__default['default'].createElement(Spinner.Spinner, {
    size: "small",
    accessibilityLabel: i18n.translate('Polaris.Button.spinnerAccessibilityLabel')
  })), action.content) : null;
  const primaryActionMarkup = action ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Banner$1['default'].PrimaryAction
  }, action.loading ? spinnerMarkup : utils.unstyledButtonFrom(action, {
    className: Banner$1['default'].Button
  })) : null;
  const secondaryActionMarkup = secondaryAction ? /*#__PURE__*/React__default['default'].createElement(SecondaryActionFrom, {
    action: secondaryAction
  }) : null;
  const actionMarkup = action || secondaryAction ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Banner$1['default'].Actions
  }, /*#__PURE__*/React__default['default'].createElement(ButtonGroup.ButtonGroup, null, primaryActionMarkup, secondaryActionMarkup)) : null;
  let contentMarkup = null;
  let contentID;

  if (children || actionMarkup) {
    contentID = `${id}Content`;
    contentMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: Banner$1['default'].Content,
      id: contentID
    }, children, actionMarkup);
  }

  const dismissButton = onDismiss && /*#__PURE__*/React__default['default'].createElement("div", {
    className: Banner$1['default'].Dismiss
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    plain: true,
    icon: polarisIcons.CancelSmallMinor,
    onClick: onDismiss,
    accessibilityLabel: "Dismiss notification"
  }));
  return /*#__PURE__*/React__default['default'].createElement(bannerContext.BannerContext.Provider, {
    value: true
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: className // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    ,
    tabIndex: 0,
    ref: wrapperRef,
    role: ariaRoleType,
    "aria-live": stopAnnouncements ? 'off' : 'polite',
    onMouseUp: handleMouseUp,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur,
    "aria-labelledby": headingID,
    "aria-describedby": contentID
  }, dismissButton, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Banner$1['default'].Ribbon
  }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
    source: iconName,
    color: iconColor
  })), /*#__PURE__*/React__default['default'].createElement("div", {
    className: Banner$1['default'].ContentWrapper
  }, headingMarkup, contentMarkup)));
});

function SecondaryActionFrom({
  action
}) {
  if (action.url) {
    return /*#__PURE__*/React__default['default'].createElement(UnstyledLink.UnstyledLink, {
      className: Banner$1['default'].SecondaryAction,
      url: action.url,
      external: action.external
    }, /*#__PURE__*/React__default['default'].createElement("span", {
      className: Banner$1['default'].Text
    }, action.content));
  }

  return /*#__PURE__*/React__default['default'].createElement(UnstyledButton.UnstyledButton, {
    className: Banner$1['default'].SecondaryAction,
    onClick: action.onAction
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: Banner$1['default'].Text
  }, action.content));
}

function useBannerAttributes(status) {
  switch (status) {
    case 'success':
      return {
        defaultIcon: polarisIcons.CircleTickMajor,
        iconColor: 'success',
        ariaRoleType: 'status'
      };

    case 'info':
      return {
        defaultIcon: polarisIcons.CircleInformationMajor,
        iconColor: 'highlight',
        ariaRoleType: 'status'
      };

    case 'warning':
      return {
        defaultIcon: polarisIcons.CircleAlertMajor,
        iconColor: 'warning',
        ariaRoleType: 'alert'
      };

    case 'critical':
      return {
        defaultIcon: polarisIcons.DiamondAlertMajor,
        iconColor: 'critical',
        ariaRoleType: 'alert'
      };

    default:
      return {
        defaultIcon: polarisIcons.CircleInformationMajor,
        iconColor: 'base',
        ariaRoleType: 'status'
      };
  }
}

function useBannerFocus(bannerRef) {
  const wrapperRef = React.useRef(null);
  const [shouldShowFocus, setShouldShowFocus] = React.useState(false);
  React.useImperativeHandle(bannerRef, () => ({
    focus: () => {
      var _wrapperRef$current;

      (_wrapperRef$current = wrapperRef.current) === null || _wrapperRef$current === void 0 ? void 0 : _wrapperRef$current.focus();
      setShouldShowFocus(true);
    }
  }), []);

  const handleKeyUp = event => {
    if (event.target === wrapperRef.current) {
      setShouldShowFocus(true);
    }
  };

  const handleBlur = () => setShouldShowFocus(false);

  const handleMouseUp = event => {
    event.currentTarget.blur();
    setShouldShowFocus(false);
  };

  return {
    wrapperRef,
    handleKeyUp,
    handleBlur,
    handleMouseUp,
    shouldShowFocus
  };
}

exports.Banner = Banner;
