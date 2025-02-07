'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var components = require('../../../../utilities/components.js');
var Header$1 = require('./Header.scss.js');
var Breadcrumbs = require('../../../Breadcrumbs/Breadcrumbs.js');
var Pagination = require('../../../Pagination/Pagination.js');
var Title = require('./components/Title/Title.js');
var ActionMenu = require('../../../ActionMenu/ActionMenu.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var hooks$1 = require('../../../../utilities/media-query/hooks.js');
var TextStyle = require('../../../TextStyle/TextStyle.js');
var utils = require('../../../Button/utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function isPrimaryAction(x) {
  return ! /*#__PURE__*/React.isValidElement(x) && x !== undefined;
}
const SHORT_TITLE = 20;
const REALLY_SHORT_TITLE = 8;
const LONG_TITLE = 34;
function Header({
  title,
  subtitle,
  titleMetadata,
  additionalMetadata,
  thumbnail,
  titleHidden = false,
  primaryAction,
  pagination,
  additionalNavigation,
  breadcrumbs = [],
  secondaryActions = [],
  actionGroups = [],
  compactTitle = false
}) {
  const i18n = hooks.useI18n();
  const {
    isNavigationCollapsed
  } = hooks$1.useMediaQuery();
  const isSingleRow = !primaryAction && !pagination && !secondaryActions.length && !actionGroups.length;
  const breadcrumbMarkup = breadcrumbs.length > 0 ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].BreadcrumbWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Breadcrumbs.Breadcrumbs, {
    breadcrumbs: breadcrumbs
  })) : null;
  const paginationMarkup = pagination && !isNavigationCollapsed ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].PaginationWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Pagination.Pagination, pagination)) : null;
  const additionalNavigationMarkup = additionalNavigation ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].AdditionalNavigationWrapper
  }, additionalNavigation) : null;
  const navigationMarkup = breadcrumbMarkup || paginationMarkup || additionalNavigationMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].Navigation
  }, breadcrumbMarkup, additionalNavigationMarkup, paginationMarkup) : null;
  const pageTitleMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].TitleWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Title.Title, {
    title: title,
    subtitle: subtitle,
    titleMetadata: titleMetadata,
    thumbnail: thumbnail,
    compactTitle: compactTitle
  }));
  const primaryActionMarkup = primaryAction ? /*#__PURE__*/React__default['default'].createElement(PrimaryActionMarkup, {
    primaryAction: primaryAction
  }) : null;
  const actionMenuMarkup = secondaryActions.length > 0 || ActionMenu.hasGroupsWithActions(actionGroups) ? /*#__PURE__*/React__default['default'].createElement(ActionMenu.ActionMenu, {
    actions: secondaryActions,
    groups: actionGroups,
    rollup: isNavigationCollapsed,
    rollupActionsLabel: title ? i18n.translate('Polaris.Page.Header.rollupActionsLabel', {
      title
    }) : undefined
  }) : null;
  const additionalMetadataMarkup = additionalMetadata ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].AdditionalMetaData
  }, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
    variation: "subdued"
  }, additionalMetadata)) : null;
  const headerClassNames = css.classNames(Header$1['default'].Header, isSingleRow && Header$1['default'].isSingleRow, titleHidden && Header$1['default'].titleHidden, navigationMarkup && Header$1['default'].hasNavigation, actionMenuMarkup && Header$1['default'].hasActionMenu, isNavigationCollapsed && Header$1['default'].mobileView, !breadcrumbs.length && Header$1['default'].noBreadcrumbs, title && title.length < LONG_TITLE && Header$1['default'].mediumTitle, title && title.length > LONG_TITLE && Header$1['default'].longTitle);
  const {
    slot1,
    slot2,
    slot3,
    slot4,
    slot5,
    slot6
  } = determineLayout({
    actionMenuMarkup,
    additionalMetadataMarkup,
    additionalNavigationMarkup,
    breadcrumbMarkup,
    isNavigationCollapsed,
    pageTitleMarkup,
    paginationMarkup,
    primaryActionMarkup,
    title
  });
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: headerClassNames
  }, /*#__PURE__*/React__default['default'].createElement(components.ConditionalRender, {
    condition: [slot1, slot2, slot3, slot4].some(notNull)
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].Row
  }, slot1, slot2, /*#__PURE__*/React__default['default'].createElement(components.ConditionalRender, {
    condition: [slot3, slot4].some(notNull)
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].RightAlign
  }, /*#__PURE__*/React__default['default'].createElement(components.ConditionalWrapper, {
    condition: [slot3, slot4].every(notNull),
    wrapper: children => /*#__PURE__*/React__default['default'].createElement("div", {
      className: Header$1['default'].Actions
    }, children)
  }, slot3, slot4))))), /*#__PURE__*/React__default['default'].createElement(components.ConditionalRender, {
    condition: [slot5, slot6].some(notNull)
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].Row
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].LeftAlign
  }, slot5), /*#__PURE__*/React__default['default'].createElement(components.ConditionalRender, {
    condition: slot6 != null
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].RightAlign
  }, slot6)))));
}

function PrimaryActionMarkup({
  primaryAction
}) {
  const {
    isNavigationCollapsed
  } = hooks$1.useMediaQuery();
  let content = primaryAction;

  if (isPrimaryAction(primaryAction)) {
    const primary = primaryAction.primary === undefined ? true : primaryAction.primary;
    content = utils.buttonsFrom(shouldShowIconOnly(isNavigationCollapsed, primaryAction), {
      primary
    });
  }

  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: Header$1['default'].PrimaryActionWrapper
  }, content);
}

function shouldShowIconOnly(isMobile, action) {
  let {
    content,
    accessibilityLabel,
    icon
  } = action;
  if (icon == null) return { ...action,
    icon: undefined
  };

  if (isMobile) {
    accessibilityLabel = accessibilityLabel || content;
    content = undefined;
  } else {
    icon = undefined;
  }

  return { ...action,
    content,
    accessibilityLabel,
    icon
  };
}

function notNull(value) {
  return value != null;
}

function determineLayout({
  actionMenuMarkup,
  additionalMetadataMarkup,
  additionalNavigationMarkup,
  breadcrumbMarkup,
  isNavigationCollapsed,
  pageTitleMarkup,
  paginationMarkup,
  primaryActionMarkup,
  title
}) {
  //    Header Layout
  // |----------------------------------------------------|
  // | slot1 | slot2 |                    | slot3 | slot4 |
  // |----------------------------------------------------|
  // | slot5 |                                    | slot6 |
  // |----------------------------------------------------|
  //
  const layouts = {
    mobileCompact: {
      slots: {
        slot1: null,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup,
        slot6: additionalNavigationMarkup
      },
      condition: isNavigationCollapsed && breadcrumbMarkup == null && title != null && title.length <= REALLY_SHORT_TITLE
    },
    mobileDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup,
        slot6: additionalNavigationMarkup
      },
      condition: isNavigationCollapsed
    },
    desktopCompact: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup,
        slot6: additionalNavigationMarkup
      },
      condition: !isNavigationCollapsed && paginationMarkup == null && actionMenuMarkup == null && title != null && title.length <= SHORT_TITLE
    },
    desktopDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, actionMenuMarkup, primaryActionMarkup),
        slot4: paginationMarkup,
        slot5: additionalMetadataMarkup,
        slot6: additionalNavigationMarkup
      },
      condition: !isNavigationCollapsed
    }
  };
  const layout = Object.values(layouts).find(layout => layout.condition) || layouts.desktopDefault;
  return layout.slots;
}

exports.Header = Header;
exports.isPrimaryAction = isPrimaryAction;
