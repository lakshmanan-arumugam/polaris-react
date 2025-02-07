'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var focus = require('../../utilities/focus.js');
var withinFilterContext = require('../../utilities/within-filter-context.js');
var types = require('../../types.js');
var Filters$1 = require('./Filters.scss.js');
var Collapsible = require('../Collapsible/Collapsible.js');
var ConnectedFilterControl = require('./components/ConnectedFilterControl/ConnectedFilterControl.js');
var TagsWrapper = require('./components/TagsWrapper/TagsWrapper.js');
var Tag = require('../Tag/Tag.js');
var Sheet = require('../Sheet/Sheet.js');
var context = require('../../utilities/resource-list/context.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/media-query/hooks.js');
var ScrollLock = require('../ScrollLock/ScrollLock.js');
var Badge = require('../Badge/Badge.js');
var TextStyle = require('../TextStyle/TextStyle.js');
var Icon = require('../Icon/Icon.js');
var Focus = require('../Focus/Focus.js');
var Button = require('../Button/Button.js');
var TextField = require('../TextField/TextField.js');
var DisplayText = require('../DisplayText/DisplayText.js');
var Scrollable = require('../Scrollable/Scrollable.js');
var KeypressListener = require('../KeypressListener/KeypressListener.js');
var Stack = require('../Stack/Stack.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var Suffix;

(function (Suffix) {
  Suffix["Filter"] = "Filter";
  Suffix["Shortcut"] = "Shortcut";
})(Suffix || (Suffix = {}));

class FiltersInner extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      open: false,
      readyForFocus: false
    };
    this.moreFiltersButtonContainer = /*#__PURE__*/React.createRef();
    this.moreFiltersDoneButtonContainer = /*#__PURE__*/React.createRef();
    this.focusNode = /*#__PURE__*/React.createRef();

    this.closeFilters = () => {
      this.setState({
        open: false
      }, () => {
        if (this.moreFiltersButtonContainer.current) {
          focus.focusFirstFocusableNode(this.moreFiltersButtonContainer.current, false);
        }
      });
    };

    this.toggleFilters = () => {
      if (this.state.open === true) {
        this.closeFilters();
      } else {
        this.openFilters();
      }
    };

    this.setReadyForFocus = newState => () => {
      this.setState({
        readyForFocus: newState
      });
    };

    this.handleClearAll = () => {
      this.props.onClearAll();
      this.moreFiltersDoneButtonContainer.current && focus.focusFirstFocusableNode(this.moreFiltersDoneButtonContainer.current, false);
    };
  }

  render() {
    const {
      filters,
      queryValue,
      onQueryBlur,
      onQueryChange,
      onQueryFocus,
      focused,
      onClearAll,
      appliedFilters,
      onQueryClear,
      queryPlaceholder,
      children,
      disabled = false,
      helpText,
      hideTags,
      hideQueryField,
      i18n,
      mediaQuery: {
        isNavigationCollapsed
      }
    } = this.props;
    const {
      resourceName
    } = this.context;
    const {
      open,
      readyForFocus
    } = this.state;
    const backdropMarkup = open ? /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(ScrollLock.ScrollLock, null), /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].Backdrop,
      onClick: this.closeFilters
    })) : null;
    const filtersContentMarkup = filters.map((filter, index) => {
      const filterIsOpen = this.state[`${filter.key}${Suffix.Filter}`] === true;
      const icon = filterIsOpen ? polarisIcons.ChevronUpMinor : polarisIcons.ChevronDownMinor;
      const className = css.classNames(Filters$1['default'].FilterTriggerContainer, filterIsOpen && Filters$1['default'].open, index === 0 && Filters$1['default'].first, filters.length !== 1 && index === filters.length - 1 && Filters$1['default'].last);
      const appliedFilterContent = this.getAppliedFilterContent(filter.key);
      const appliedFilterBadgeMarkup = appliedFilterContent ? /*#__PURE__*/React__default['default'].createElement("div", {
        className: Filters$1['default'].AppliedFilterBadgeContainer
      }, /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
        size: "small",
        status: "new"
      }, appliedFilterContent)) : null;
      const collapsibleID = `${filter.key}Collapsible`;
      const buttonClassName = css.classNames(Filters$1['default'].FilterTrigger);
      return /*#__PURE__*/React__default['default'].createElement("div", {
        key: filter.key,
        className: className
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        onClick: () => this.toggleFilter(filter.key),
        className: buttonClassName,
        id: `${filter.key}ToggleButton`,
        type: "button",
        "aria-controls": collapsibleID,
        "aria-expanded": filterIsOpen
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: Filters$1['default'].FilterTriggerLabelContainer
      }, /*#__PURE__*/React__default['default'].createElement("h3", {
        className: Filters$1['default'].FilterTriggerTitle
      }, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
        variation: this.props.disabled || filter.disabled ? 'subdued' : undefined
      }, filter.label)), /*#__PURE__*/React__default['default'].createElement("span", {
        className: Filters$1['default'].FilterTriggerIcon
      }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
        source: icon,
        color: "base"
      }))), appliedFilterBadgeMarkup), /*#__PURE__*/React__default['default'].createElement(Collapsible.Collapsible, {
        id: collapsibleID,
        open: filterIsOpen
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: Filters$1['default'].FilterNodeContainer
      }, /*#__PURE__*/React__default['default'].createElement(Focus.Focus, {
        disabled: !filterIsOpen || !readyForFocus || !open,
        root: this.focusNode
      }, this.generateFilterMarkup(filter)))));
    });
    const appliedFiltersCount = appliedFilters ? appliedFilters.length : 0;
    const moreFiltersLabel = hideTags && appliedFiltersCount > 0 ? i18n.translate('Polaris.Filters.moreFiltersWithCount', {
      count: appliedFiltersCount
    }) : i18n.translate('Polaris.Filters.moreFilters');
    const rightActionMarkup = filters.length ? /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.moreFiltersButtonContainer
    }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: this.toggleFilters,
      disabled: disabled
    }, moreFiltersLabel)) : null;
    const filterResourceName = resourceName || {
      singular: i18n.translate('Polaris.ResourceList.defaultItemSingular'),
      plural: i18n.translate('Polaris.ResourceList.defaultItemPlural')
    };
    const transformedFilters = this.transformFilters(filters);
    const filtersControlMarkup = /*#__PURE__*/React__default['default'].createElement(ConnectedFilterControl.ConnectedFilterControl, {
      rightPopoverableActions: transformedFilters,
      rightAction: rightActionMarkup,
      auxiliary: children,
      disabled: disabled,
      forceShowMorefiltersButton: filters.length > transformedFilters.length,
      queryFieldHidden: hideQueryField
    }, hideQueryField ? null : /*#__PURE__*/React__default['default'].createElement(TextField.TextField, {
      placeholder: queryPlaceholder || i18n.translate('Polaris.Filters.filter', {
        resourceName: filterResourceName.plural
      }),
      onChange: onQueryChange,
      onBlur: onQueryBlur,
      onFocus: onQueryFocus,
      value: queryValue,
      focused: focused,
      label: queryPlaceholder || i18n.translate('Polaris.Filters.filter', {
        resourceName: filterResourceName.plural
      }),
      labelHidden: true,
      prefix: /*#__PURE__*/React__default['default'].createElement("span", {
        className: Filters$1['default'].SearchIcon
      }, /*#__PURE__*/React__default['default'].createElement(Icon.Icon, {
        source: polarisIcons.SearchMinor
      })),
      clearButton: true,
      onClearButtonClick: onQueryClear,
      disabled: disabled,
      autoComplete: "off"
    }));
    const filtersContainerHeaderClassname = css.classNames(Filters$1['default'].FiltersContainerHeader);
    const filtersDesktopHeaderMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: filtersContainerHeaderClassname
    }, /*#__PURE__*/React__default['default'].createElement(DisplayText.DisplayText, {
      size: "small",
      element: "h3"
    }, moreFiltersLabel), /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      icon: polarisIcons.CancelSmallMinor,
      plain: true,
      accessibilityLabel: i18n.translate('Polaris.Filters.cancel'),
      onClick: this.closeFilters
    }));
    const filtersMobileHeaderMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: filtersContainerHeaderClassname
    }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      icon: polarisIcons.CancelSmallMinor,
      plain: true,
      accessibilityLabel: i18n.translate('Polaris.Filters.cancel'),
      onClick: this.closeFilters
    }), /*#__PURE__*/React__default['default'].createElement(DisplayText.DisplayText, {
      size: "small",
      element: "h3"
    }, moreFiltersLabel), /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: this.closeFilters,
      primary: true
    }, i18n.translate('Polaris.Filters.done')));
    const filtersDesktopFooterClassname = css.classNames(Filters$1['default'].FiltersContainerFooter);
    const filtersDesktopFooterMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: filtersDesktopFooterClassname
    }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: this.handleClearAll,
      disabled: !this.hasAppliedFilters()
    }, i18n.translate('Polaris.Filters.clearAllFilters')), /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.moreFiltersDoneButtonContainer
    }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: this.closeFilters,
      primary: true
    }, i18n.translate('Polaris.Filters.done'))));
    const filtersMobileFooterMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].FiltersMobileContainerFooter
    }, this.hasAppliedFilters() ? /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      onClick: onClearAll,
      fullWidth: true
    }, i18n.translate('Polaris.Filters.clearAllFilters')) : /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].EmptyFooterState
    }, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
      variation: "subdued"
    }, /*#__PURE__*/React__default['default'].createElement("p", null, i18n.translate('Polaris.Filters.noFiltersApplied')))));
    const shouldHideTagsContainer = !appliedFilters || appliedFilters.length < 1;
    const tagsMarkup = !hideTags ? /*#__PURE__*/React__default['default'].createElement(TagsWrapper.TagsWrapper, {
      hidden: shouldHideTagsContainer
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].TagsContainer,
      "aria-live": "polite"
    }, (appliedFilters || []).map(filter => {
      return /*#__PURE__*/React__default['default'].createElement(Tag.Tag, {
        key: filter.key,
        onRemove: () => {
          filter.onRemove(filter.key);
        },
        disabled: disabled
      }, filter.label);
    }))) : null;
    const filtersMobileContainerContentClassName = css.classNames(Filters$1['default'].FiltersMobileContainerContent);
    const filtersDesktopContainerContentClassName = css.classNames(Filters$1['default'].FiltersDesktopContainerContent);
    const filtersContainerMarkup = isNavigationCollapsed ? /*#__PURE__*/React__default['default'].createElement(Sheet.Sheet, {
      accessibilityLabel: moreFiltersLabel,
      open: open,
      onClose: this.closeFilters,
      onEntered: this.setReadyForFocus(true),
      onExit: this.setReadyForFocus(false)
    }, filtersMobileHeaderMarkup, /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable, {
      className: filtersMobileContainerContentClassName,
      shadow: true
    }, filtersContentMarkup, filtersMobileFooterMarkup)) : /*#__PURE__*/React__default['default'].createElement(Sheet.Sheet, {
      accessibilityLabel: moreFiltersLabel,
      open: open,
      onClose: this.closeFilters,
      onEntered: this.setReadyForFocus(true),
      onExit: this.setReadyForFocus(false)
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].FiltersContainer
    }, filtersDesktopHeaderMarkup, /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable, {
      className: filtersDesktopContainerContentClassName,
      shadow: true
    }, filtersContentMarkup), filtersDesktopFooterMarkup));
    const helpTextMarkup = helpText ? /*#__PURE__*/React__default['default'].createElement("div", {
      id: "FiltersHelpText",
      className: Filters$1['default'].HelpText
    }, /*#__PURE__*/React__default['default'].createElement(TextStyle.TextStyle, {
      variation: "subdued"
    }, helpText)) : null;
    return /*#__PURE__*/React__default['default'].createElement(withinFilterContext.WithinFilterContext.Provider, {
      value: true
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: Filters$1['default'].Filters
    }, filtersControlMarkup, filtersContainerMarkup, tagsMarkup, helpTextMarkup, backdropMarkup, /*#__PURE__*/React__default['default'].createElement(KeypressListener.KeypressListener, {
      keyCode: types.Key.Escape,
      handler: this.closeFilters
    })));
  }

  hasAppliedFilters() {
    const {
      appliedFilters,
      queryValue
    } = this.props;
    const filtersApplied = Boolean(appliedFilters && appliedFilters.length > 0);
    const queryApplied = Boolean(queryValue && queryValue !== '');
    return filtersApplied || queryApplied;
  }

  getAppliedFilterContent(key) {
    const {
      appliedFilters
    } = this.props;

    if (!appliedFilters) {
      return undefined;
    }

    const filter = appliedFilters.find(filter => filter.key === key);
    return filter == null ? undefined : filter.label;
  }

  getAppliedFilterRemoveHandler(key) {
    const {
      appliedFilters
    } = this.props;

    if (!appliedFilters) {
      return undefined;
    }

    const filter = appliedFilters.find(filter => filter.key === key);
    return filter == null ? undefined : filter.onRemove;
  }

  openFilters() {
    this.setState({
      open: true
    });
  }

  openFilter(key) {
    this.setState({
      [`${key}${Suffix.Filter}`]: true
    });
  }

  closeFilter(key) {
    this.setState({
      [`${key}${Suffix.Filter}`]: false
    });
  }

  toggleFilter(key) {
    if (this.state[`${key}${Suffix.Filter}`] === true) {
      this.closeFilter(key);
    } else {
      this.openFilter(key);
    }
  }

  openFilterShortcut(key) {
    this.setState({
      [`${key}${Suffix.Shortcut}`]: true
    });
  }

  closeFilterShortcut(key) {
    this.setState({
      [`${key}${Suffix.Shortcut}`]: false
    });
  }

  toggleFilterShortcut(key) {
    if (this.state[`${key}${Suffix.Shortcut}`] === true) {
      this.closeFilterShortcut(key);
    } else {
      this.openFilterShortcut(key);
    }
  }

  transformFilters(filters) {
    const transformedActions = [];
    getShortcutFilters(filters).forEach(filter => {
      const {
        key,
        label,
        disabled
      } = filter;
      transformedActions.push({
        popoverContent: this.generateFilterMarkup(filter),
        popoverOpen: Boolean(this.state[`${key}${Suffix.Shortcut}`]),
        key,
        content: label,
        disabled,
        onAction: () => this.toggleFilterShortcut(key)
      });
    });
    return transformedActions;
  }

  generateFilterMarkup(filter) {
    const i18n = this.props.i18n;
    const removeCallback = this.getAppliedFilterRemoveHandler(filter.key);
    const removeHandler = removeCallback == null ? undefined : () => {
      removeCallback(filter.key);
    };
    const clearButtonMarkup = !filter.hideClearButton && /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      plain: true,
      disabled: removeHandler == null,
      onClick: removeHandler,
      accessibilityLabel: i18n.translate('Polaris.Filters.clearLabel', {
        filterName: filter.label
      })
    }, i18n.translate('Polaris.Filters.clear'));
    return /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.focusNode
    }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
      vertical: true,
      spacing: "tight"
    }, filter.filter, clearButtonMarkup));
  }

}

FiltersInner.contextType = context.ResourceListContext;

function getShortcutFilters(filters) {
  return filters.filter(filter => filter.shortcut === true);
}

function Filters(props) {
  const i18n = hooks.useI18n();
  const mediaQuery = hooks$1.useMediaQuery();
  return /*#__PURE__*/React__default['default'].createElement(FiltersInner, Object.assign({}, props, {
    i18n: i18n,
    mediaQuery: mediaQuery
  }));
}

exports.Filters = Filters;
