import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { EnableSelectionMinor } from '@shopify/polaris-icons';
import debounce from 'lodash/debounce';
import { CSSTransition } from 'react-transition-group';
import { durationFast } from '@shopify/polaris-tokens';
import { useToggle } from '../../utilities/use-toggle.js';
import { classNames } from '../../utilities/css.js';
import styles from './IndexTable.scss.js';
import { IndexProvider } from '../IndexProvider/IndexProvider.js';
import { Cell } from './components/Cell/Cell.js';
import { Row } from './components/Row/Row.js';
import { SELECT_ALL_ITEMS, SelectionType } from '../../utilities/index-provider/types.js';
import { getTableHeadingsBySelector } from './utilities/utilities.js';
import { AfterInitialMount } from '../AfterInitialMount/AfterInitialMount.js';
import { EmptySearchResult } from '../EmptySearchResult/EmptySearchResult.js';
import { ScrollContainer } from './components/ScrollContainer/ScrollContainer.js';
import { Sticky } from '../Sticky/Sticky.js';
import { BulkActions } from '../BulkActions/BulkActions.js';
import { useIndexValue, useIndexSelectionChange } from '../../utilities/index-provider/hooks.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Stack } from '../Stack/Stack.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Spinner } from '../Spinner/Spinner.js';
import { EventListener } from '../EventListener/EventListener.js';
import { Badge } from '../Badge/Badge.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';
import { Button } from '../Button/Button.js';

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
  } = useIndexValue();
  const handleSelectionChange = useIndexSelectionChange();
  const i18n = useI18n();
  const {
    value: hasMoreLeftColumns,
    toggle: toggleHasMoreLeftColumns
  } = useToggle(false);
  const tablePosition = useRef({
    top: 0,
    left: 0
  });
  const tableHeadingRects = useRef([]);
  const scrollableContainerElement = useRef(null);
  const tableElement = useRef(null);
  const condensedListElement = useRef(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [isSmallScreenSelectable, setIsSmallScreenSelectable] = useState(false);
  const [stickyWrapper, setStickyWrapper] = useState(null);
  const tableHeadings = useRef([]);
  const stickyTableHeadings = useRef([]);
  const stickyHeaderWrapperElement = useRef(null);
  const firstStickyHeaderElement = useRef(null);
  const stickyHeaderElement = useRef(null);
  const scrollBarElement = useRef(null);
  const scrollingWithBar = useRef(false);
  const scrollingContainer = useRef(false);
  const tableBodyRef = useCallback(node => {
    if (node !== null && !tableInitialized) {
      setTableInitialized(true);
    }
  }, [tableInitialized]);
  const toggleIsSmallScreenSelectable = useCallback(() => {
    setIsSmallScreenSelectable(value => !value);
  }, []);
  const handleSelectAllItemsInStore = useCallback(() => {
    handleSelectionChange(selectedItemsCount === SELECT_ALL_ITEMS ? SelectionType.Page : SelectionType.All, true);
  }, [handleSelectionChange, selectedItemsCount]);
  const calculateFirstHeaderOffset = useCallback(() => {
    if (!selectable) {
      return tableHeadingRects.current[0].offsetWidth;
    }

    return condensed ? tableHeadingRects.current[0].offsetWidth : tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth;
  }, [condensed, selectable]);
  const resizeTableHeadings = useMemo(() => debounce(() => {
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
  const resizeTableScrollBar = useCallback(() => {
    if (scrollBarElement.current && tableElement.current && tableInitialized) {
      scrollBarElement.current.style.setProperty('--p-scroll-bar-content-width', `${tableElement.current.offsetWidth - SCROLL_BAR_PADDING}px`);
    }
  }, [tableInitialized]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const debounceResizeTableScrollbar = useCallback(debounce(resizeTableScrollBar, SCROLL_BAR_DEBOUNCE_PERIOD, {
    trailing: true
  }), [resizeTableScrollBar]);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const handleCanScrollRight = useCallback(() => {
    if (!lastColumnSticky || !tableElement.current || !scrollableContainerElement.current) {
      return;
    }

    const tableRect = tableElement.current.getBoundingClientRect();
    const scrollableRect = scrollableContainerElement.current.getBoundingClientRect();
    setCanScrollRight(tableRect.width > scrollableRect.width);
  }, [lastColumnSticky]);
  useEffect(() => {
    handleCanScrollRight();
  }, [handleCanScrollRight]);
  const handleResize = useCallback(() => {
    var _scrollBarElement$cur;

    // hide the scrollbar when resizing
    (_scrollBarElement$cur = scrollBarElement.current) === null || _scrollBarElement$cur === void 0 ? void 0 : _scrollBarElement$cur.style.setProperty('--p-scroll-bar-content-width', `0px`);
    resizeTableHeadings();
    debounceResizeTableScrollbar();
    handleCanScrollRight();
  }, [debounceResizeTableScrollbar, resizeTableHeadings, handleCanScrollRight]);
  const handleScrollContainerScroll = useCallback((canScrollLeft, canScrollRight) => {
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
  const handleScrollBarScroll = useCallback(() => {
    if (!scrollableContainerElement.current || !scrollBarElement.current) {
      return;
    }

    if (!scrollingContainer.current) {
      scrollingWithBar.current = true;
      scrollableContainerElement.current.scrollLeft = scrollBarElement.current.scrollLeft;
    }

    scrollingContainer.current = false;
  }, []);
  useEffect(() => {
    tableHeadings.current = getTableHeadingsBySelector(tableElement.current, '[data-index-table-heading]');
    stickyTableHeadings.current = getTableHeadingsBySelector(stickyHeaderWrapperElement.current, '[data-index-table-sticky-heading]');
    resizeTableHeadings();
  }, [headings, resizeTableHeadings, firstStickyHeaderElement, tableInitialized]);
  useEffect(() => {
    resizeTableScrollBar();
    setStickyWrapper(condensed ? condensedListElement.current : tableElement.current);
  }, [tableInitialized, resizeTableScrollBar, condensed]);
  useEffect(() => {
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
  const stickyColumnHeader = /*#__PURE__*/React.createElement("div", {
    className: styles.TableHeading,
    key: headings[0].title,
    style: stickyColumnHeaderStyle,
    "data-index-table-sticky-heading": true
  }, /*#__PURE__*/React.createElement(Stack, {
    spacing: "none",
    wrap: false,
    alignment: "center"
  }, selectable && /*#__PURE__*/React.createElement("div", {
    className: styles.FirstStickyHeaderElement,
    ref: firstStickyHeaderElement
  }, renderCheckboxContent()), selectable && /*#__PURE__*/React.createElement("div", {
    className: styles['StickyTableHeading-second-scrolling']
  }, renderHeadingContent(headings[0])), !selectable && /*#__PURE__*/React.createElement("div", {
    className: styles.FirstStickyHeaderElement,
    ref: firstStickyHeaderElement
  }, renderHeadingContent(headings[0]))));
  const stickyHeadingsMarkup = headings.map(renderStickyHeading);
  const selectedItemsCountLabel = selectedItemsCount === SELECT_ALL_ITEMS ? `${itemCount}+` : selectedItemsCount;
  const handleTogglePage = useCallback(() => {
    handleSelectionChange(SelectionType.Page, Boolean(!bulkSelectState || bulkSelectState === 'indeterminate'));
  }, [bulkSelectState, handleSelectionChange]);
  const paginatedSelectAllAction = getPaginatedSelectAllAction();
  const loadingTransitionClassNames = {
    enter: styles['LoadingContainer-enter'],
    enterActive: styles['LoadingContainer-enter-active'],
    exit: styles['LoadingContainer-exit'],
    exitActive: styles['LoadingContainer-exit-active']
  };
  const loadingMarkup = /*#__PURE__*/React.createElement(CSSTransition, {
    in: loading,
    classNames: loadingTransitionClassNames,
    timeout: durationFast,
    appear: true,
    unmountOnExit: true
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.LoadingPanel
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.LoadingPanelRow
  }, /*#__PURE__*/React.createElement(Spinner, {
    size: "small"
  }), /*#__PURE__*/React.createElement("span", {
    className: styles.LoadingPanelText
  }, i18n.translate('Polaris.IndexTable.resourceLoadingAccessibilityLabel', {
    resourceNamePlural: resourceName.plural.toLocaleLowerCase()
  })))));
  const stickyTableClassNames = classNames(styles.StickyTable, condensed && styles['StickyTable-condensed']);
  const shouldShowBulkActions = bulkActionsSelectable && selectedItemsCount || isSmallScreenSelectable;
  const stickyHeaderMarkup = /*#__PURE__*/React.createElement("div", {
    className: stickyTableClassNames,
    role: "presentation"
  }, /*#__PURE__*/React.createElement(Sticky, {
    boundingElement: stickyWrapper
  }, isSticky => {
    const stickyHeaderClassNames = classNames(styles.StickyTableHeader, isSticky && styles['StickyTableHeader-isSticky']);
    const bulkActionClassNames = classNames(styles.BulkActionsWrapper, condensed && styles['StickyTableHeader-condensed'], isSticky && styles['StickyTableHeader-isSticky']);
    const shouldShowActions = !condensed || selectedItemsCount;
    const promotedActions = shouldShowActions ? promotedBulkActions : [];
    const actions = shouldShowActions ? bulkActions : [];
    const bulkActionsMarkup = shouldShowBulkActions ? /*#__PURE__*/React.createElement("div", {
      className: bulkActionClassNames,
      "data-condensed": condensed
    }, loadingMarkup, /*#__PURE__*/React.createElement(BulkActions, {
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
    const stickyColumnHeaderClassNames = classNames(styles.StickyTableColumnHeader, hasMoreLeftColumns && styles['StickyTableColumnHeader-isScrolling']);
    const selectButtonMarkup = /*#__PURE__*/React.createElement(Button, {
      icon: EnableSelectionMinor,
      onClick: toggleIsSmallScreenSelectable
    }, i18n.translate('Polaris.IndexTable.selectButtonText'));
    const headerMarkup = condensed ? /*#__PURE__*/React.createElement("div", {
      className: classNames(styles.HeaderWrapper, !selectable && styles.unselectable)
    }, loadingMarkup, sort, selectable && selectButtonMarkup) : /*#__PURE__*/React.createElement("div", {
      className: stickyHeaderClassNames,
      ref: stickyHeaderWrapperElement
    }, loadingMarkup, /*#__PURE__*/React.createElement("div", {
      className: stickyColumnHeaderClassNames
    }, stickyColumnHeader), /*#__PURE__*/React.createElement("div", {
      className: styles.StickyTableHeadings,
      ref: stickyHeaderElement
    }, stickyHeadingsMarkup));
    const stickyContent = bulkActionsMarkup ? bulkActionsMarkup : headerMarkup;
    return stickyContent;
  }));
  const scrollBarWrapperClassNames = classNames(styles.ScrollBarContainer, condensed && styles.scrollBarContainerCondensed);
  const scrollBarClassNames = classNames(tableElement.current && tableInitialized && styles.ScrollBarContent);
  const scrollBarMarkup = itemCount > 0 ? /*#__PURE__*/React.createElement(AfterInitialMount, null, /*#__PURE__*/React.createElement("div", {
    className: scrollBarWrapperClassNames
  }, /*#__PURE__*/React.createElement("div", {
    onScroll: handleScrollBarScroll,
    className: styles.ScrollBar,
    ref: scrollBarElement
  }, /*#__PURE__*/React.createElement("div", {
    className: scrollBarClassNames
  })))) : null;
  const tableClassNames = classNames(styles.Table, hasMoreLeftColumns && styles['Table-scrolling'], selectMode && styles.disableTextSelection, selectMode && shouldShowBulkActions && styles.selectMode, !selectable && styles['Table-unselectable'], lastColumnSticky && styles['Table-sticky-last'], lastColumnSticky && canScrollRight && styles['Table-sticky-scrolling']);
  const emptyStateMarkup = emptyState ? emptyState : /*#__PURE__*/React.createElement(EmptySearchResult, {
    title: i18n.translate('Polaris.IndexTable.emptySearchTitle', {
      resourceNamePlural: resourceName.plural
    }),
    description: i18n.translate('Polaris.IndexTable.emptySearchDescription'),
    withIllustration: true
  });
  const sharedMarkup = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(EventListener, {
    event: "resize",
    handler: handleResize
  }), /*#__PURE__*/React.createElement(AfterInitialMount, null, stickyHeaderMarkup));
  const bodyMarkup = condensed ? /*#__PURE__*/React.createElement(React.Fragment, null, sharedMarkup, /*#__PURE__*/React.createElement("ul", {
    "data-selectmode": Boolean(selectMode || isSmallScreenSelectable),
    className: styles.CondensedList,
    ref: condensedListElement
  }, children)) : /*#__PURE__*/React.createElement(React.Fragment, null, sharedMarkup, /*#__PURE__*/React.createElement(ScrollContainer, {
    scrollableContainerRef: scrollableContainerElement,
    onScroll: handleScrollContainerScroll
  }, /*#__PURE__*/React.createElement("table", {
    ref: tableElement,
    className: tableClassNames
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: styles.HeadingRow
  }, headingsMarkup)), /*#__PURE__*/React.createElement("tbody", {
    ref: tableBodyRef
  }, children))));
  const tableContentMarkup = itemCount > 0 ? bodyMarkup : /*#__PURE__*/React.createElement("div", {
    className: styles.EmptySearchResultWrapper
  }, emptyStateMarkup);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.IndexTable
  }, !shouldShowBulkActions && !condensed && loadingMarkup, tableContentMarkup), scrollBarMarkup);

  function renderHeading(heading, index) {
    const isSecond = index === 0;
    const isLast = index === headings.length - 1;
    const headingContentClassName = classNames(styles.TableHeading, isSecond && styles['TableHeading-second'], isLast && !heading.hidden && styles['TableHeading-last'], !selectable && styles['TableHeading-unselectable']);
    const stickyPositioningStyle = selectable !== false && isSecond && tableHeadingRects.current && tableHeadingRects.current.length > 0 ? {
      left: tableHeadingRects.current[0].offsetWidth
    } : undefined;
    const headingContent = /*#__PURE__*/React.createElement("th", {
      className: headingContentClassName,
      key: heading.title,
      "data-index-table-heading": true,
      style: stickyPositioningStyle
    }, renderHeadingContent(heading));

    if (index !== 0 || !selectable) {
      return headingContent;
    }

    const checkboxClassName = classNames(styles.TableHeading, index === 0 && styles['TableHeading-first']);
    const checkboxContent = /*#__PURE__*/React.createElement("th", {
      className: checkboxClassName,
      key: `${heading}-${index}`,
      "data-index-table-heading": true
    }, renderCheckboxContent());
    return [checkboxContent, headingContent];
  }

  function renderCheckboxContent() {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.ColumnHeaderCheckboxWrapper
    }, /*#__PURE__*/React.createElement(Checkbox, {
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
      headingContent = /*#__PURE__*/React.createElement(Stack, {
        wrap: false,
        alignment: "center"
      }, /*#__PURE__*/React.createElement("span", null, heading.title), /*#__PURE__*/React.createElement(Badge, {
        status: "new"
      }, i18n.translate('Polaris.IndexTable.onboardingBadgeText')));
    } else if (heading.hidden) {
      headingContent = /*#__PURE__*/React.createElement(VisuallyHidden, null, heading.title);
    } else {
      headingContent = heading.title;
    }

    return headingContent;
  }

  function handleSelectPage(checked) {
    handleSelectionChange(SelectionType.Page, checked);
  }

  function renderStickyHeading(heading, index) {
    const position = index + 1;
    const headingStyle = tableHeadingRects.current && tableHeadingRects.current.length > position ? {
      minWidth: tableHeadingRects.current[position].offsetWidth
    } : undefined;
    const headingContent = renderHeadingContent(heading);
    const stickyHeadingClassName = classNames(styles.TableHeading, index === 0 && styles['StickyTableHeading-second'], index === 0 && !selectable && styles.unselectable);
    return /*#__PURE__*/React.createElement("div", {
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

    const actionText = selectedItemsCount === SELECT_ALL_ITEMS ? i18n.translate('Polaris.IndexTable.undo') : i18n.translate('Polaris.IndexTable.selectAllItems', {
      itemsLength: itemCount,
      resourceNamePlural: resourceName.plural.toLocaleLowerCase()
    });
    return {
      content: actionText,
      onAction: handleSelectAllItemsInStore
    };
  }

  function handleSelectModeToggle(val) {
    handleSelectionChange(SelectionType.All, false);
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
  return /*#__PURE__*/React.createElement(IndexProvider, {
    selectable: selectable,
    itemCount: itemCount,
    selectedItemsCount: selectedItemsCount,
    resourceName: passedResourceName,
    loading: loading,
    hasMoreItems: hasMoreItems,
    condensed: condensed,
    onSelectionChange: onSelectionChange
  }, /*#__PURE__*/React.createElement(IndexTableBase, indexTableBaseProps, children));
}
IndexTable.Cell = Cell;
IndexTable.Row = Row;

export { IndexTable };
