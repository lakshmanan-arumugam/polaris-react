'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var components = require('../../utilities/components.js');
var useLazyRef = require('../../utilities/use-lazy-ref.js');
var ResourceList$1 = require('./ResourceList.scss.js');
var Select = require('../Select/Select.js');
var ResourceItem = require('../ResourceItem/ResourceItem.js');
var types = require('../../utilities/resource-list/types.js');
var hooks = require('../../utilities/i18n/hooks.js');
var BulkActions = require('../BulkActions/BulkActions.js');
var Button = require('../Button/Button.js');
var CheckableButton = require('../CheckableButton/CheckableButton.js');
var Sticky = require('../Sticky/Sticky.js');
var EventListener = require('../EventListener/EventListener.js');
var EmptySearchResult = require('../EmptySearchResult/EmptySearchResult.js');
var Spinner = require('../Spinner/Spinner.js');
var context = require('../../utilities/resource-list/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

const SMALL_SCREEN_WIDTH = 458;
const SMALL_SPINNER_HEIGHT = 28;
const LARGE_SPINNER_HEIGHT = 45;

function getAllItemsOnPage(items, idForItem) {
  return items.map((item, index) => {
    return idForItem(item, index);
  });
}

const isSmallScreen = () => {
  return typeof window === 'undefined' ? false : window.innerWidth < SMALL_SCREEN_WIDTH;
};

function defaultIdForItem(item, index) {
  return Object.prototype.hasOwnProperty.call(item, 'id') ? item.id : index.toString();
}

const ResourceList = function ResourceList({
  items,
  filterControl,
  emptyState,
  emptySearchState,
  resourceName: resourceNameProp,
  promotedBulkActions,
  bulkActions,
  selectedItems = [],
  isFiltered,
  selectable,
  hasMoreItems,
  loading,
  showHeader,
  totalItemsCount,
  sortValue,
  sortOptions,
  alternateTool,
  onSortChange,
  onSelectionChange,
  renderItem,
  idForItem = defaultIdForItem,
  resolveItemId
}) {
  const i18n = hooks.useI18n();
  const [selectMode, setSelectMode] = React.useState(Boolean(selectedItems && selectedItems.length > 0));
  const [loadingPosition, setLoadingPositionState] = React.useState(0);
  const [lastSelected, setLastSelected] = React.useState();
  const [smallScreen, setSmallScreen] = React.useState(isSmallScreen());
  const forceUpdate = React.useReducer((x = 0) => x + 1, 0)[1];
  const [checkableButtons, setCheckableButtons] = React.useState(new Map());
  const defaultResourceName = useLazyRef.useLazyRef(() => ({
    singular: i18n.translate('Polaris.ResourceList.defaultItemSingular'),
    plural: i18n.translate('Polaris.ResourceList.defaultItemPlural')
  }));
  const listRef = React.useRef(null);

  const handleSelectMode = selectMode => {
    setSelectMode(selectMode);

    if (!selectMode && onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleResize = debounce__default['default'](() => {
    const newSmallScreen = isSmallScreen();

    if (selectedItems && selectedItems.length === 0 && selectMode && !newSmallScreen) {
      handleSelectMode(false);
    }

    if (smallScreen !== newSmallScreen) {
      setSmallScreen(newSmallScreen);
    }
  }, 50, {
    leading: true,
    trailing: true,
    maxWait: 50
  });
  const isSelectable = Boolean(promotedBulkActions && promotedBulkActions.length > 0 || bulkActions && bulkActions.length > 0 || selectable);

  const bulkSelectState = () => {
    let selectState = 'indeterminate';

    if (!selectedItems || Array.isArray(selectedItems) && selectedItems.length === 0) {
      selectState = false;
    } else if (selectedItems === types.SELECT_ALL_ITEMS || Array.isArray(selectedItems) && selectedItems.length === items.length) {
      selectState = true;
    }

    return selectState;
  };

  const resourceName = resourceNameProp ? resourceNameProp : defaultResourceName.current;

  const headerTitle = () => {
    const itemsCount = items.length;
    const resource = !loading && (!totalItemsCount && itemsCount === 1 || totalItemsCount === 1) ? resourceName.singular : resourceName.plural;

    if (loading) {
      return i18n.translate('Polaris.ResourceList.loading', {
        resource
      });
    } else if (totalItemsCount) {
      return i18n.translate('Polaris.ResourceList.showingTotalCount', {
        itemsCount,
        totalItemsCount,
        resource
      });
    } else {
      return i18n.translate('Polaris.ResourceList.showing', {
        itemsCount,
        resource
      });
    }
  };

  const bulkActionsLabel = () => {
    const selectedItemsCount = selectedItems === types.SELECT_ALL_ITEMS ? `${items.length}+` : selectedItems.length;
    return i18n.translate('Polaris.ResourceList.selected', {
      selectedItemsCount
    });
  };

  const bulkActionsAccessibilityLabel = () => {
    const selectedItemsCount = selectedItems.length;
    const totalItemsCount = items.length;
    const allSelected = selectedItemsCount === totalItemsCount;

    if (totalItemsCount === 1 && allSelected) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxDeselectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (totalItemsCount === 1) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxSelectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (allSelected) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxDeselectAllMultiple', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    } else {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxSelectAllMultiple', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    }
  };

  const paginatedSelectAllText = () => {
    if (!isSelectable || !hasMoreItems) {
      return;
    }

    if (selectedItems === types.SELECT_ALL_ITEMS) {
      return i18n.translate(isFiltered ? 'Polaris.ResourceList.allFilteredItemsSelected' : 'Polaris.ResourceList.allItemsSelected', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    }
  };

  const paginatedSelectAllAction = () => {
    if (!isSelectable || !hasMoreItems) {
      return;
    }

    const actionText = selectedItems === types.SELECT_ALL_ITEMS ? i18n.translate('Polaris.Common.undo') : i18n.translate(isFiltered ? 'Polaris.ResourceList.selectAllFilteredItems' : 'Polaris.ResourceList.selectAllItems', {
      itemsLength: items.length,
      resourceNamePlural: resourceName.plural
    });
    return {
      content: actionText,
      onAction: handleSelectAllItemsInStore
    };
  };

  const emptySearchResultText = {
    title: i18n.translate('Polaris.ResourceList.emptySearchResultTitle', {
      resourceNamePlural: resourceName.plural
    }),
    description: i18n.translate('Polaris.ResourceList.emptySearchResultDescription')
  };

  const handleSelectAllItemsInStore = () => {
    const newlySelectedItems = selectedItems === types.SELECT_ALL_ITEMS ? getAllItemsOnPage(items, idForItem) : types.SELECT_ALL_ITEMS;

    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    }
  };

  const setLoadingPosition = React.useCallback(() => {
    if (listRef.current != null) {
      if (typeof window === 'undefined') {
        return;
      }

      const overlay = listRef.current.getBoundingClientRect();
      const viewportHeight = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
      const overflow = viewportHeight - overlay.height;
      const spinnerHeight = items.length === 1 ? SMALL_SPINNER_HEIGHT : LARGE_SPINNER_HEIGHT;
      const spinnerPosition = overflow > 0 ? (overlay.height - spinnerHeight) / 2 : (viewportHeight - overlay.top - spinnerHeight) / 2;
      setLoadingPositionState(spinnerPosition);
    }
  }, [listRef, items.length]);
  const itemsExist = items.length > 0;
  React.useEffect(() => {
    if (loading) {
      setLoadingPosition();
    }
  }, [loading, setLoadingPosition]);
  React.useEffect(() => {
    if (selectedItems && selectedItems.length > 0 && !selectMode) {
      setSelectMode(true);
    }

    if ((!selectedItems || selectedItems.length === 0) && !isSmallScreen()) {
      setSelectMode(false);
    }
  }, [selectedItems, selectMode]);
  React.useEffect(() => {
    forceUpdate();
  }, [forceUpdate, items]);

  const renderItemWithId = (item, index) => {
    const id = idForItem(item, index);
    const itemContent = renderItem(item, id, index);

    if (process.env.NODE_ENV === 'development' && !components.isElementOfType(itemContent, ResourceItem.ResourceItem)) {
      // eslint-disable-next-line no-console
      console.warn('<ResourceList /> renderItem function should return a <ResourceItem />.');
    }

    return itemContent;
  };

  const handleMultiSelectionChange = (lastSelected, currentSelected, resolveItemId) => {
    const min = Math.min(lastSelected, currentSelected);
    const max = Math.max(lastSelected, currentSelected);
    return items.slice(min, max + 1).map(resolveItemId);
  };

  const handleCheckableButtonRegistration = (key, button) => {
    if (!checkableButtons.get(key)) {
      setCheckableButtons(new Map(checkableButtons).set(key, button));
    }
  };

  const handleSelectionChange = (selected, id, sortOrder, shiftKey) => {
    if (selectedItems == null || onSelectionChange == null) {
      return;
    }

    let newlySelectedItems = selectedItems === types.SELECT_ALL_ITEMS ? getAllItemsOnPage(items, idForItem) : [...selectedItems];

    if (sortOrder !== undefined) {
      setLastSelected(sortOrder);
    }

    const lastSelectedFromState = lastSelected;
    let selectedIds = [id];

    if (shiftKey && lastSelectedFromState != null && sortOrder !== undefined && resolveItemId) {
      selectedIds = handleMultiSelectionChange(lastSelectedFromState, sortOrder, resolveItemId);
    }

    newlySelectedItems = [...new Set([...newlySelectedItems, ...selectedIds])];

    if (!selected) {
      for (const selectedId of selectedIds) {
        newlySelectedItems.splice(newlySelectedItems.indexOf(selectedId), 1);
      }
    }

    if (newlySelectedItems.length === 0 && !isSmallScreen()) {
      handleSelectMode(false);
    } else if (newlySelectedItems.length > 0) {
      handleSelectMode(true);
    }

    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    }
  };

  const handleToggleAll = () => {
    let newlySelectedItems;

    if (Array.isArray(selectedItems) && selectedItems.length === items.length || selectedItems === types.SELECT_ALL_ITEMS) {
      newlySelectedItems = [];
    } else {
      newlySelectedItems = items.map((item, index) => {
        return idForItem(item, index);
      });
    }

    if (newlySelectedItems.length === 0 && !isSmallScreen()) {
      handleSelectMode(false);
    } else if (newlySelectedItems.length > 0) {
      handleSelectMode(true);
    }

    let checkbox;

    if (isSmallScreen()) {
      checkbox = checkableButtons.get('bulkSm');
    } else if (newlySelectedItems.length === 0) {
      checkbox = checkableButtons.get('plain');
    } else {
      checkbox = checkableButtons.get('bulkLg');
    }

    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    } // setTimeout ensures execution after the Transition on BulkActions


    setTimeout(() => {
      checkbox && checkbox.focus();
    }, 0);
  };

  const bulkActionsMarkup = isSelectable ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].BulkActionsWrapper
  }, /*#__PURE__*/React__default['default'].createElement(BulkActions.BulkActions, {
    label: bulkActionsLabel(),
    accessibilityLabel: bulkActionsAccessibilityLabel(),
    selected: bulkSelectState(),
    onToggleAll: handleToggleAll,
    selectMode: selectMode,
    onSelectModeToggle: handleSelectMode,
    promotedActions: promotedBulkActions,
    paginatedSelectAllAction: paginatedSelectAllAction(),
    paginatedSelectAllText: paginatedSelectAllText(),
    actions: bulkActions,
    disabled: loading,
    smallScreen: smallScreen
  })) : null;
  const filterControlMarkup = filterControl ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].FiltersWrapper
  }, filterControl) : null;
  const sortingSelectMarkup = sortOptions && sortOptions.length > 0 && !alternateTool ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].SortWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Select.Select, {
    label: i18n.translate('Polaris.ResourceList.sortingLabel'),
    labelInline: !smallScreen,
    labelHidden: smallScreen,
    options: sortOptions,
    onChange: onSortChange,
    value: sortValue,
    disabled: selectMode
  })) : null;
  const alternateToolMarkup = alternateTool && !sortingSelectMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].AlternateToolWrapper
  }, alternateTool) : null;
  const headerTitleMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].HeaderTitleWrapper
  }, headerTitle());
  const selectButtonMarkup = isSelectable ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].SelectButtonWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Button.Button, {
    disabled: selectMode,
    icon: polarisIcons.EnableSelectionMinor,
    onClick: () => handleSelectMode(true)
  }, i18n.translate('Polaris.ResourceList.selectButtonText'))) : null;
  const checkableButtonMarkup = isSelectable ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].CheckableButtonWrapper
  }, /*#__PURE__*/React__default['default'].createElement(CheckableButton.CheckableButton, {
    accessibilityLabel: bulkActionsAccessibilityLabel(),
    label: headerTitle(),
    onToggleAll: handleToggleAll,
    plain: true,
    disabled: loading
  })) : null;
  const needsHeader = isSelectable || sortOptions && sortOptions.length > 0 || alternateTool;
  const headerWrapperOverlay = loading ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default']['HeaderWrapper-overlay']
  }) : null;
  const showEmptyState = emptyState && !itemsExist && !loading;
  const showEmptySearchState = !showEmptyState && filterControl && !itemsExist && !loading;
  const headerMarkup = !showEmptyState && showHeader !== false && !showEmptySearchState && (showHeader || needsHeader) && listRef.current && /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].HeaderOuterWrapper
  }, /*#__PURE__*/React__default['default'].createElement(Sticky.Sticky, {
    boundingElement: listRef.current
  }, isSticky => {
    const headerClassName = css.classNames(ResourceList$1['default'].HeaderWrapper, sortOptions && sortOptions.length > 0 && !alternateTool && ResourceList$1['default']['HeaderWrapper-hasSort'], alternateTool && ResourceList$1['default']['HeaderWrapper-hasAlternateTool'], isSelectable && ResourceList$1['default']['HeaderWrapper-hasSelect'], loading && ResourceList$1['default']['HeaderWrapper-disabled'], isSelectable && selectMode && ResourceList$1['default']['HeaderWrapper-inSelectMode'], isSticky && ResourceList$1['default']['HeaderWrapper-isSticky']);
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: headerClassName
    }, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "resize",
      handler: handleResize
    }), headerWrapperOverlay, /*#__PURE__*/React__default['default'].createElement("div", {
      className: ResourceList$1['default'].HeaderContentWrapper
    }, headerTitleMarkup, checkableButtonMarkup, alternateToolMarkup, sortingSelectMarkup, selectButtonMarkup), bulkActionsMarkup);
  }));
  const emptySearchStateMarkup = showEmptySearchState ? emptySearchState || /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].EmptySearchResultWrapper
  }, /*#__PURE__*/React__default['default'].createElement(EmptySearchResult.EmptySearchResult, Object.assign({}, emptySearchResultText, {
    withIllustration: true
  }))) : null;
  const emptyStateMarkup = showEmptyState ? emptyState : null;
  const defaultTopPadding = 8;
  const topPadding = loadingPosition > 0 ? loadingPosition : defaultTopPadding;
  const spinnerStyle = {
    paddingTop: `${topPadding}px`
  };
  const spinnerSize = items.length < 2 ? 'small' : 'large';
  const loadingOverlay = loading ? /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement("li", {
    className: ResourceList$1['default'].SpinnerContainer,
    style: spinnerStyle
  }, /*#__PURE__*/React__default['default'].createElement(Spinner.Spinner, {
    size: spinnerSize,
    accessibilityLabel: "Items are loading"
  })), /*#__PURE__*/React__default['default'].createElement("li", {
    className: ResourceList$1['default'].LoadingOverlay
  })) : null;
  const className = css.classNames(ResourceList$1['default'].ItemWrapper, loading && ResourceList$1['default']['ItemWrapper-isLoading']);
  const loadingWithoutItemsMarkup = loading && !itemsExist ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    tabIndex: -1
  }, loadingOverlay) : null;
  const resourceListClassName = css.classNames(ResourceList$1['default'].ResourceList, loading && ResourceList$1['default'].disabledPointerEvents, selectMode && ResourceList$1['default'].disableTextSelection);
  const listMarkup = itemsExist ? /*#__PURE__*/React__default['default'].createElement("ul", {
    className: resourceListClassName,
    ref: listRef,
    "aria-live": "polite",
    "aria-busy": loading
  }, loadingOverlay, React.Children.toArray(items.map(renderItemWithId))) : null; // This is probably a legit error but I don't have the time to refactor this
  // eslint-disable-next-line react/jsx-no-constructed-context-values

  const context$1 = {
    selectable: isSelectable,
    selectedItems,
    selectMode,
    resourceName,
    loading,
    onSelectionChange: handleSelectionChange,
    registerCheckableButtons: handleCheckableButtonRegistration
  };
  return /*#__PURE__*/React__default['default'].createElement(context.ResourceListContext.Provider, {
    value: context$1
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: ResourceList$1['default'].ResourceListWrapper
  }, filterControlMarkup, headerMarkup, listMarkup, emptySearchStateMarkup, emptyStateMarkup, loadingWithoutItemsMarkup));
};
ResourceList.Item = ResourceItem.ResourceItem;

exports.ResourceList = ResourceList;
