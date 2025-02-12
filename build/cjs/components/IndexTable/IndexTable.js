'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var debounce = require('lodash/debounce');
var reactTransitionGroup = require('react-transition-group');
var polarisTokens = require('@shopify/polaris-tokens');
var useToggle = require('../../utilities/use-toggle.js');
var css = require('../../utilities/css.js');
var IndexTable$1 = require('./IndexTable.scss.js');
var IndexProvider = require('../IndexProvider/IndexProvider.js');
var Cell = require('./components/Cell/Cell.js');
var Row = require('./components/Row/Row.js');
var types = require('../../utilities/index-provider/types.js');
var utilities = require('./utilities/utilities.js');
var AfterInitialMount = require('../AfterInitialMount/AfterInitialMount.js');
var EmptySearchResult = require('../EmptySearchResult/EmptySearchResult.js');
var ScrollContainer = require('./components/ScrollContainer/ScrollContainer.js');
var Sticky = require('../Sticky/Sticky.js');
var BulkActions = require('../BulkActions/BulkActions.js');
var hooks = require('../../utilities/index-provider/hooks.js');
var hooks$1 = require('../../utilities/i18n/hooks.js');
var Stack = require('../Stack/Stack.js');
var Checkbox = require('../Checkbox/Checkbox.js');
var Spinner = require('../Spinner/Spinner.js');
var EventListener = require('../EventListener/EventListener.js');
var Badge = require('../Badge/Badge.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');
var Button = require('../Button/Button.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

const SCROLL_BAR_PADDING = 4;
const SIXTY_FPS = 1000 / 60;
const SCROLL_BAR_DEBOUNCE_PERIOD = 300;
const SMALL_SCREEN_WIDTH = 458;

function IndexTableBase({
  headings,
  bulkActions = [],
  promotedBulkActions = [],
  children,
  emptyState,
  sort,
  lastColumnSticky = false
}) {
  const {
    loading,
    bulkSelectState,
    resourceName,
    bulkActionsAccessibilityLabel,
    selectable,
    selectMode,
    paginatedSelectAllText,
    itemCount,
    hasMoreItems,
    selectedItemsCount,
    condensed
  } = hooks.useIndexValue();
  const handleSelectionChange = hooks.useIndexSelectionChange();
  const i18n = hooks$1.useI18n();
  const {
    value: hasMoreLeftColumns,
    toggle: toggleHasMoreLeftColumns
  } = useToggle.useToggle(false);
  const tablePosition = React.useRef({
    top: 0,
    left: 0
  });
  const tableHeadingRects = React.useRef([]);
  const scrollableContainerElement = React.useRef(null);
  const tableElement = React.useRef(null);
  const condensedListElement = React.useRef(null);
  const [tableInitialized, setTableInitialized] = React.useState(false);
  const [isSmallScreenSelectable, setIsSmallScreenSelectable] = React.useState(false);
  const [stickyWrapper, setStickyWrapper] = React.useState(null);
  const tableHeadings = React.useRef([]);
  const stickyTableHeadings = React.useRef([]);
  const stickyHeaderWrapperElement = React.useRef(null);
  const firstStickyHeaderElement = React.useRef(null);
  const stickyHeaderElement = React.useRef(null);
  const scrollBarElement = React.useRef(null);
  const scrollingWithBar = React.useRef(false);
  const scrollingContainer = React.useRef(false);
  const tableBodyRef = React.useCallback(node => {
    if (node !== null && !tableInitialized) {
      setTableInitialized(true);
    }
  }, [tableInitialized]);
  const toggleIsSmallScreenSelectable = React.useCallback(() => {
    setIsSmallScreenSelectable(value => !value);
  }, []);
  const handleSelectAllItemsInStore = React.useCallback(() => {
    handleSelectionChange(selectedItemsCount === types.SELECT_ALL_ITEMS ? types.SelectionType.Page : types.SelectionType.All, true);
  }, [handleSelectionChange, selectedItemsCount]);
  const calculateFirstHeaderOffset = React.useCallback(() => {
    if (!selectable) {
      return tableHeadingRects.current[0].offsetWidth;
    }

    return condensed ? tableHeadingRects.current[0].offsetWidth : tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth;
  }, [condensed, selectable]);
  const resizeTableHeadings = React.useMemo(() => debounce__default['default'](() => {
    if (!tableElement.current || !scrollableContainerElement.current) {
      return;
    }

    const boundingRect = scrollableContainerElement.current.getBoundingClientRect();
    tablePosition.current = {
      top: boundingRect.top,
      left: boundingRect.left
    };
    tableHeadingRects.current = tableHeadings.current.map(heading => ({
      offsetWidth: heading.offsetWidth || 0,
      offsetLeft: heading.offsetLeft || 0
    }));

    if (tableHeadings.current.length === 0) {
      return;
    } // update left offset for first column


    if (selectable && tableHeadings.current.length > 1) tableHeadings.current[1].style.left = `${tableHeadingRects.current[0].offsetWidth}px`; // update the min width of the checkbox to be the be the un-padded width of the first heading

    if (selectable && firstStickyHeaderElement !== null && firstStickyHeaderElement !== void 0 && firstStickyHeaderElement.current) {
      const elementStyle = getComputedStyle(tableHeadings.current[0]);
      const boxWidth = tableHeadings.current[0].offsetWidth;
      firstStickyHeaderElement.current.style.minWidth = `calc(${boxWidth}px - ${elementStyle.paddingLeft} - ${elementStyle.paddingRight} + 2px)`;
    } // update sticky header min-widths


    stickyTableHeadings.current.forEach((heading, index) => {
      let minWidth = 0;

      if (index === 0 && (!isSmallScreen() || !selectable)) {
        minWidth = calculateFirstHeaderOffset();
      } else if (selectable && tableHeadingRects.current.length > index) {
        var _tableHeadingRects$cu;

        minWidth = ((_tableHeadingRects$cu = tableHeadingRects.current[index]) === null || _tableHeadingRects$cu === void 0 ? void 0 : _tableHeadingRects$cu.offsetWidth) || 0;
      } else if (!selectable && tableHeadingRects.current.length >= index) {
        var _tableHeadingRects$cu2;

        minWidth = ((_tableHeadingRects$cu2 = tableHeadingRects.current[index - 1]) === null || _tableHeadingRects$cu2 === void 0 ? void 0 : _tableHeadingRects$cu2.offsetWidth) || 0;
      }

      heading.style.minWidth = `${minWidth}px`;
    });
  }, SIXTY_FPS, {
    leading: true,
    trailing: true,
    maxWait: SIXTY_FPS
  }), [calculateFirstHeaderOffset, selectable]);
  const resizeTableScrollBar = React.useCallback(() => {
    if (scrollBarElement.current && tableElement.current && tableInitialized) {
      scrollBarElement.current.style.setProperty('--p-scroll-bar-content-width', `${tableElement.current.offsetWidth - SCROLL_BAR_PADDING}px`);
    }
  }, [tableInitialized]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const debounceResizeTableScrollbar = React.useCallback(debounce__default['default'](resizeTableScrollBar, SCROLL_BAR_DEBOUNCE_PERIOD, {
    trailing: true
  }), [resizeTableScrollBar]);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const handleCanScrollRight = React.useCallback(() => {
    if (!lastColumnSticky || !tableElement.current || !scrollableContainerElement.current) {
      return;
    }

    const tableRect = tableElement.current.getBoundingClientRect();
    const scrollableRect = scrollableContainerElement.current.getBoundingClientRect();
    setCanScrollRight(tableRect.width > scrollableRect.width);
  }, [lastColumnSticky]);
  React.useEffect(() => {
    handleCanScrollRight();
  }, [handleCanScrollRight]);
  const handleResize = React.useCallback(() => {
    var _scrollBarElement$cur;

    // hide the scrollbar when resizing
    (_scrollBarElement$cur = scrollBarElement.current) === null || _scrollBarElement$cur === void 0 ? void 0 : _scrollBarElement$cur.style.setProperty('--p-scroll-bar-content-width', `0px`);
    resizeTableHeadings();
    debounceResizeTableScrollbar();
    handleCanScrollRight();
  }, [debounceResizeTableScrollbar, resizeTableHeadings, handleCanScrollRight]);
  const handleScrollContainerScroll = React.useCallback((canScrollLeft, canScrollRight) => {
    if (!scrollableContainerElement.current || !scrollBarElement.current) {
      return;
    }

    if (!scrollingWithBar.current) {
      scrollingContainer.current = true;
      scrollBarElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
    }

    scrollingWithBar.current = false;

    if (stickyHeaderElement.current) {
      stickyHeaderElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
    }

    if (canScrollLeft && !hasMoreLeftColumns || !canScrollLeft && hasMoreLeftColumns) {
      toggleHasMoreLeftColumns();
    }

    setCanScrollRight(canScrollRight);
  }, [hasMoreLeftColumns, toggleHasMoreLeftColumns]);
  const handleScrollBarScroll = React.useCallback(() => {
    if (!scrollableContainerElement.current || !scrollBarElement.current) {
      return;
    }

    if (!scrollingContainer.current) {
      scrollingWithBar.current = true;
      scrollableContainerElement.current.scrollLeft = scrollBarElement.current.scrollLeft;
    }

    scrollingContainer.current = false;
  }, []);
  React.useEffect(() => {
    tableHeadings.current = utilities.getTableHeadingsBySelector(tableElement.current, '[data-index-table-heading]');
    stickyTableHeadings.current = utilities.getTableHeadingsBySelector(stickyHeaderWrapperElement.current, '[data-index-table-sticky-heading]');
    resizeTableHeadings();
  }, [headings, resizeTableHeadings, firstStickyHeaderElement, tableInitialized]);
  React.useEffect(() => {
    resizeTableScrollBar();
    setStickyWrapper(condensed ? condensedListElement.current : tableElement.current);
  }, [tableInitialized, resizeTableScrollBar, condensed]);
  React.useEffect(() => {
    if (!condensed && isSmallScreenSelectable) {
      setIsSmallScreenSelectable(false);
    }
  }, [condensed, isSmallScreenSelectable]);
  const hasBulkActions = Boolean(promotedBulkActions && promotedBulkActions.length > 0 || bulkActions && bulkActions.length > 0);
  const headingsMarkup = headings.map(renderHeading).reduce((acc, heading) => acc.concat(heading), []);
  const bulkActionsSelectable = Boolean(promotedBulkActions.length > 0 || bulkActions.length > 0);
  const stickyColumnHeaderStyle = tableHeadingRects.current && tableHeadingRects.current.length > 0 ? {
    minWidth: calculateFirstHeaderOffset()
  } : undefined;
  const stickyColumnHeader = /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].TableHeading,
    key: headings[0].title,
    style: stickyColumnHeaderStyle,
    "data-index-table-sticky-heading": true
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    spacing: "none",
    wrap: false,
    alignment: "center"
  }, selectable && /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].FirstStickyHeaderElement,
    ref: firstStickyHeaderElement
  }, renderCheckboxContent()), selectable && /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default']['StickyTableHeading-second-scrolling']
  }, renderHeadingContent(headings[0])), !selectable && /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].FirstStickyHeaderElement,
    ref: firstStickyHeaderElement
  }, renderHeadingContent(headings[0]))));
  const stickyHeadingsMarkup = headings.map(renderStickyHeading);
  const selectedItemsCountLabel = selectedItemsCount === types.SELECT_ALL_ITEMS ? `${itemCount}+` : selectedItemsCount;
  const handleTogglePage = React.useCallback(() => {
    handleSelectionChange(types.SelectionType.Page, Boolean(!bulkSelectState || bulkSelectState === 'indeterminate'));
  }, [bulkSelectState, handleSelectionChange]);
  const paginatedSelectAllAction = getPaginatedSelectAllAction();
  const loadingTransitionClassNames = {
    enter: IndexTable$1['default']['LoadingContainer-enter'],
    enterActive: IndexTable$1['default']['LoadingContainer-enter-active'],
    exit: IndexTable$1['default']['LoadingContainer-exit'],
    exitActive: IndexTable$1['default']['LoadingContainer-exit-active']
  };
  const loadingMarkup = /*#__PURE__*/React__default['default'].createElement(reactTransitionGroup.CSSTransition, {
    in: loading,
    classNames: loadingTransitionClassNames,
    timeout: polarisTokens.durationFast,
    appear: true,
    unmountOnExit: true
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].LoadingPanel
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].LoadingPanelRow
  }, /*#__PURE__*/React__default['default'].createElement(Spinner.Spinner, {
    size: "small"
  }), /*#__PURE__*/React__default['default'].createElement("span", {
    className: IndexTable$1['default'].LoadingPanelText
  }, i18n.translate('Polaris.IndexTable.resourceLoadingAccessibilityLabel', {
    resourceNamePlural: resourceName.plural.toLocaleLowerCase()
  })))));
  const stickyTableClassNames = css.classNames(IndexTable$1['default'].StickyTable, condensed && IndexTable$1['default']['StickyTable-condensed']);
  const shouldShowBulkActions = bulkActionsSelectable && selectedItemsCount || isSmallScreenSelectable;
  const stickyHeaderMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: stickyTableClassNames,
    role: "presentation"
  }, /*#__PURE__*/React__default['default'].createElement(Sticky.Sticky, {
    boundingElement: stickyWrapper
  }, isSticky => {
    const stickyHeaderClassNames = css.classNames(IndexTable$1['default'].StickyTableHeader, isSticky && IndexTable$1['default']['StickyTableHeader-isSticky']);
    const bulkActionClassNames = css.classNames(IndexTable$1['default'].BulkActionsWrapper, condensed && IndexTable$1['default']['StickyTableHeader-condensed'], isSticky && IndexTable$1['default']['StickyTableHeader-isSticky']);
    const shouldShowActions = !condensed || selectedItemsCount;
    const promotedActions = shouldShowActions ? promotedBulkActions : [];
    const actions = shouldShowActions ? bulkActions : [];
    const bulkActionsMarkup = shouldShowBulkActions ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: bulkActionClassNames,
      "data-condensed": condensed
    }, loadingMarkup, /*#__PURE__*/React__default['default'].createElement(BulkActions.BulkActions, {
      smallScreen: condensed,
      label: i18n.translate('Polaris.IndexTable.selected', {
        selectedItemsCount: selectedItemsCountLabel
      }),
      accessibilityLabel: bulkActionsAccessibilityLabel,
      selected: bulkSelectState,
      selectMode: selectMode || isSmallScreenSelectable,
      onToggleAll: handleTogglePage,
      promotedActions: promotedActions,
      actions: actions,
      paginatedSelectAllText: paginatedSelectAllText,
      paginatedSelectAllAction: paginatedSelectAllAction,
      onSelectModeToggle: condensed ? handleSelectModeToggle : undefined
    })) : null;
    const stickyColumnHeaderClassNames = css.classNames(IndexTable$1['default'].StickyTableColumnHeader, hasMoreLeftColumns && IndexTable$1['default']['StickyTableColumnHeader-isScrolling']);
    const selectButtonMarkup = /*#__PURE__*/React__default['default'].createElement(Button.Button, {
      icon: polarisIcons.EnableSelectionMinor,
      onClick: toggleIsSmallScreenSelectable
    }, i18n.translate('Polaris.IndexTable.selectButtonText'));
    const headerMarkup = condensed ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: css.classNames(IndexTable$1['default'].HeaderWrapper, !selectable && IndexTable$1['default'].unselectable)
    }, loadingMarkup, sort, selectable && selectButtonMarkup) : /*#__PURE__*/React__default['default'].createElement("div", {
      className: stickyHeaderClassNames,
      ref: stickyHeaderWrapperElement
    }, loadingMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
      className: stickyColumnHeaderClassNames
    }, stickyColumnHeader), /*#__PURE__*/React__default['default'].createElement("div", {
      className: IndexTable$1['default'].StickyTableHeadings,
      ref: stickyHeaderElement
    }, stickyHeadingsMarkup));
    const stickyContent = bulkActionsMarkup ? bulkActionsMarkup : headerMarkup;
    return stickyContent;
  }));
  const scrollBarWrapperClassNames = css.classNames(IndexTable$1['default'].ScrollBarContainer, condensed && IndexTable$1['default'].scrollBarContainerCondensed);
  const scrollBarClassNames = css.classNames(tableElement.current && tableInitialized && IndexTable$1['default'].ScrollBarContent);
  const scrollBarMarkup = itemCount > 0 ? /*#__PURE__*/React__default['default'].createElement(AfterInitialMount.AfterInitialMount, null, /*#__PURE__*/React__default['default'].createElement("div", {
    className: scrollBarWrapperClassNames
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    onScroll: handleScrollBarScroll,
    className: IndexTable$1['default'].ScrollBar,
    ref: scrollBarElement
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: scrollBarClassNames
  })))) : null;
  const tableClassNames = css.classNames(IndexTable$1['default'].Table, hasMoreLeftColumns && IndexTable$1['default']['Table-scrolling'], selectMode && IndexTable$1['default'].disableTextSelection, selectMode && shouldShowBulkActions && IndexTable$1['default'].selectMode, !selectable && IndexTable$1['default']['Table-unselectable'], lastColumnSticky && IndexTable$1['default']['Table-sticky-last'], lastColumnSticky && canScrollRight && IndexTable$1['default']['Table-sticky-scrolling']);
  const emptyStateMarkup = emptyState ? emptyState : /*#__PURE__*/React__default['default'].createElement(EmptySearchResult.EmptySearchResult, {
    title: i18n.translate('Polaris.IndexTable.emptySearchTitle', {
      resourceNamePlural: resourceName.plural
    }),
    description: i18n.translate('Polaris.IndexTable.emptySearchDescription'),
    withIllustration: true
  });
  const sharedMarkup = /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
    event: "resize",
    handler: handleResize
  }), /*#__PURE__*/React__default['default'].createElement(AfterInitialMount.AfterInitialMount, null, stickyHeaderMarkup));
  const bodyMarkup = condensed ? /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, sharedMarkup, /*#__PURE__*/React__default['default'].createElement("ul", {
    "data-selectmode": Boolean(selectMode || isSmallScreenSelectable),
    className: IndexTable$1['default'].CondensedList,
    ref: condensedListElement
  }, children)) : /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, sharedMarkup, /*#__PURE__*/React__default['default'].createElement(ScrollContainer.ScrollContainer, {
    scrollableContainerRef: scrollableContainerElement,
    onScroll: handleScrollContainerScroll
  }, /*#__PURE__*/React__default['default'].createElement("table", {
    ref: tableElement,
    className: tableClassNames
  }, /*#__PURE__*/React__default['default'].createElement("thead", null, /*#__PURE__*/React__default['default'].createElement("tr", {
    className: IndexTable$1['default'].HeadingRow
  }, headingsMarkup)), /*#__PURE__*/React__default['default'].createElement("tbody", {
    ref: tableBodyRef
  }, children))));
  const tableContentMarkup = itemCount > 0 ? bodyMarkup : /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].EmptySearchResultWrapper
  }, emptyStateMarkup);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement("div", {
    className: IndexTable$1['default'].IndexTable
  }, !shouldShowBulkActions && !condensed && loadingMarkup, tableContentMarkup), scrollBarMarkup);

  function renderHeading(heading, index) {
    const isSecond = index === 0;
    const isLast = index === headings.length - 1;
    const headingContentClassName = css.classNames(IndexTable$1['default'].TableHeading, isSecond && IndexTable$1['default']['TableHeading-second'], isLast && !heading.hidden && IndexTable$1['default']['TableHeading-last'], !selectable && IndexTable$1['default']['TableHeading-unselectable']);
    const stickyPositioningStyle = selectable !== false && isSecond && tableHeadingRects.current && tableHeadingRects.current.length > 0 ? {
      left: tableHeadingRects.current[0].offsetWidth
    } : undefined;
    const headingContent = /*#__PURE__*/React__default['default'].createElement("th", {
      className: headingContentClassName,
      key: heading.title,
      "data-index-table-heading": true,
      style: stickyPositioningStyle
    }, renderHeadingContent(heading));

    if (index !== 0 || !selectable) {
      return headingContent;
    }

    const checkboxClassName = css.classNames(IndexTable$1['default'].TableHeading, index === 0 && IndexTable$1['default']['TableHeading-first']);
    const checkboxContent = /*#__PURE__*/React__default['default'].createElement("th", {
      className: checkboxClassName,
      key: `${heading}-${index}`,
      "data-index-table-heading": true
    }, renderCheckboxContent());
    return [checkboxContent, headingContent];
  }

  function renderCheckboxContent() {
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: IndexTable$1['default'].ColumnHeaderCheckboxWrapper
    }, /*#__PURE__*/React__default['default'].createElement(Checkbox.Checkbox, {
      label: i18n.translate('Polaris.IndexTable.selectAllLabel', {
        resourceNamePlural: resourceName.plural
      }),
      labelHidden: true,
      onChange: handleSelectPage,
      checked: bulkSelectState
    }));
  }

  function renderHeadingContent(heading) {
    let headingContent;

    if (heading.new) {
      headingContent = /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
        wrap: false,
        alignment: "center"
      }, /*#__PURE__*/React__default['default'].createElement("span", null, heading.title), /*#__PURE__*/React__default['default'].createElement(Badge.Badge, {
        status: "new"
      }, i18n.translate('Polaris.IndexTable.onboardingBadgeText')));
    } else if (heading.hidden) {
      headingContent = /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, heading.title);
    } else {
      headingContent = heading.title;
    }

    return headingContent;
  }

  function handleSelectPage(checked) {
    handleSelectionChange(types.SelectionType.Page, checked);
  }

  function renderStickyHeading(heading, index) {
    const position = index + 1;
    const headingStyle = tableHeadingRects.current && tableHeadingRects.current.length > position ? {
      minWidth: tableHeadingRects.current[position].offsetWidth
    } : undefined;
    const headingContent = renderHeadingContent(heading);
    const stickyHeadingClassName = css.classNames(IndexTable$1['default'].TableHeading, index === 0 && IndexTable$1['default']['StickyTableHeading-second'], index === 0 && !selectable && IndexTable$1['default'].unselectable);
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: stickyHeadingClassName,
      key: heading.title,
      style: headingStyle,
      "data-index-table-sticky-heading": true
    }, headingContent);
  }

  function getPaginatedSelectAllAction() {
    if (!selectable || !hasBulkActions || !hasMoreItems) {
      return;
    }

    const actionText = selectedItemsCount === types.SELECT_ALL_ITEMS ? i18n.translate('Polaris.IndexTable.undo') : i18n.translate('Polaris.IndexTable.selectAllItems', {
      itemsLength: itemCount,
      resourceNamePlural: resourceName.plural.toLocaleLowerCase()
    });
    return {
      content: actionText,
      onAction: handleSelectAllItemsInStore
    };
  }

  function handleSelectModeToggle(val) {
    handleSelectionChange(types.SelectionType.All, false);
    setIsSmallScreenSelectable(val);
  }
}

const isSmallScreen = () => {
  return typeof window === 'undefined' ? false : window.innerWidth < SMALL_SCREEN_WIDTH;
};

function IndexTable({
  children,
  selectable = true,
  itemCount,
  selectedItemsCount = 0,
  resourceName: passedResourceName,
  loading,
  hasMoreItems,
  condensed,
  onSelectionChange,
  ...indexTableBaseProps
}) {
  return /*#__PURE__*/React__default['default'].createElement(IndexProvider.IndexProvider, {
    selectable: selectable,
    itemCount: itemCount,
    selectedItemsCount: selectedItemsCount,
    resourceName: passedResourceName,
    loading: loading,
    hasMoreItems: hasMoreItems,
    condensed: condensed,
    onSelectionChange: onSelectionChange
  }, /*#__PURE__*/React__default['default'].createElement(IndexTableBase, indexTableBaseProps, children));
}
IndexTable.Cell = Cell.Cell;
IndexTable.Row = Row.Row;

exports.IndexTable = IndexTable;
