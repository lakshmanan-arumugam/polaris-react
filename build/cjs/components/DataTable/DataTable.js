'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var isEqual = require('lodash/isEqual');
var css = require('../../utilities/css.js');
var shared = require('../shared.js');
var utilities = require('./utilities.js');
var DataTable$1 = require('./DataTable.scss.js');
var Cell = require('./components/Cell/Cell.js');
var Navigation = require('./components/Navigation/Navigation.js');
var hooks = require('../../utilities/i18n/hooks.js');
var EventListener = require('../EventListener/EventListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);

class DataTableInner extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      condensed: false,
      columnVisibilityData: [],
      isScrolledFarthestLeft: true,
      isScrolledFarthestRight: false
    };
    this.dataTable = /*#__PURE__*/React.createRef();
    this.scrollContainer = /*#__PURE__*/React.createRef();
    this.table = /*#__PURE__*/React.createRef();
    this.handleResize = debounce__default['default'](() => {
      const {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        }
      } = this;
      let condensed = false;

      if (table && scrollContainer) {
        condensed = table.scrollWidth > scrollContainer.clientWidth;
      }

      this.setState({
        condensed,
        ...this.calculateColumnVisibilityData(condensed)
      });
    });

    this.calculateColumnVisibilityData = condensed => {
      const {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        },
        dataTable: {
          current: dataTable
        }
      } = this;

      if (condensed && table && scrollContainer && dataTable) {
        const headerCells = table.querySelectorAll(shared.headerCell.selector);

        if (headerCells.length > 0) {
          const firstVisibleColumnIndex = headerCells.length - 1;
          const tableLeftVisibleEdge = scrollContainer.scrollLeft;
          const tableRightVisibleEdge = scrollContainer.scrollLeft + dataTable.offsetWidth;
          const tableData = {
            firstVisibleColumnIndex,
            tableLeftVisibleEdge,
            tableRightVisibleEdge
          };
          const columnVisibilityData = [...headerCells].map(utilities.measureColumn(tableData));
          const lastColumn = columnVisibilityData[columnVisibilityData.length - 1];
          return {
            columnVisibilityData,
            ...utilities.getPrevAndCurrentColumns(tableData, columnVisibilityData),
            isScrolledFarthestLeft: tableLeftVisibleEdge === 0,
            isScrolledFarthestRight: lastColumn.rightEdge <= tableRightVisibleEdge
          };
        }
      }

      return {
        columnVisibilityData: [],
        previousColumn: undefined,
        currentColumn: undefined
      };
    };

    this.scrollListener = () => {
      this.setState(prevState => ({ ...this.calculateColumnVisibilityData(prevState.condensed)
      }));
    };

    this.navigateTable = direction => {
      const {
        currentColumn,
        previousColumn
      } = this.state;
      const {
        current: scrollContainer
      } = this.scrollContainer;

      const handleScroll = () => {
        if (!currentColumn || !previousColumn) {
          return;
        }

        if (scrollContainer) {
          scrollContainer.scrollLeft = direction === 'right' ? currentColumn.rightEdge : previousColumn.leftEdge;
          requestAnimationFrame(() => {
            this.setState(prevState => ({ ...this.calculateColumnVisibilityData(prevState.condensed)
            }));
          });
        }
      };

      return handleScroll;
    };

    this.renderHeadings = (heading, headingIndex) => {
      const {
        sortable,
        truncate = false,
        columnContentTypes,
        defaultSortDirection,
        initialSortColumnIndex = 0,
        verticalAlign
      } = this.props;
      const {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex
      } = this.state;
      let sortableHeadingProps;
      const id = `heading-cell-${headingIndex}`;

      if (sortable) {
        const isSortable = sortable[headingIndex];
        const isSorted = isSortable && sortedColumnIndex === headingIndex;
        const direction = isSorted ? sortDirection : 'none';
        sortableHeadingProps = {
          defaultSortDirection,
          sorted: isSorted,
          sortable: isSortable,
          sortDirection: direction,
          onSort: this.defaultOnSort(headingIndex)
        };
      }

      return /*#__PURE__*/React__default['default'].createElement(Cell.Cell, Object.assign({
        header: true,
        key: id,
        content: heading,
        contentType: columnContentTypes[headingIndex],
        firstColumn: headingIndex === 0,
        truncate: truncate
      }, sortableHeadingProps, {
        verticalAlign: verticalAlign
      }));
    };

    this.totalsRowHeading = () => {
      const {
        i18n,
        totals,
        totalsName
      } = this.props;
      const totalsLabel = totalsName ? totalsName : {
        singular: i18n.translate('Polaris.DataTable.totalRowHeading'),
        plural: i18n.translate('Polaris.DataTable.totalsRowHeading')
      };
      return totals && totals.filter(total => total !== '').length > 1 ? totalsLabel.plural : totalsLabel.singular;
    };

    this.renderTotals = (total, index) => {
      const id = `totals-cell-${index}`;
      const {
        truncate = false,
        verticalAlign
      } = this.props;
      let content;
      let contentType;

      if (index === 0) {
        content = this.totalsRowHeading();
      }

      if (total !== '' && index > 0) {
        contentType = 'numeric';
        content = total;
      }

      const totalInFooter = this.props.showTotalsInFooter;
      return /*#__PURE__*/React__default['default'].createElement(Cell.Cell, {
        total: true,
        totalInFooter: totalInFooter,
        firstColumn: index === 0,
        key: id,
        content: content,
        contentType: contentType,
        truncate: truncate,
        verticalAlign: verticalAlign
      });
    };

    this.getColSpan = (rowLength, headingsLength, contentTypesLength, cellIndex) => {
      const rowLen = rowLength ? rowLength : 1;
      const colLen = headingsLength ? headingsLength : contentTypesLength;
      const colSpan = Math.floor(colLen / rowLen);
      const remainder = colLen % rowLen;
      return cellIndex === 0 ? colSpan + remainder : colSpan;
    };

    this.defaultRenderRow = (row, index) => {
      const {
        columnContentTypes,
        truncate = false,
        verticalAlign,
        hoverable = true,
        headings
      } = this.props;
      const className = css.classNames(DataTable$1['default'].TableRow, hoverable && DataTable$1['default'].hoverable);
      return /*#__PURE__*/React__default['default'].createElement("tr", {
        key: `row-${index}`,
        className: className
      }, row.map((content, cellIndex) => {
        const id = `cell-${cellIndex}-row-${index}`;
        const colSpan = this.getColSpan(row.length, headings.length, columnContentTypes.length, cellIndex);
        return /*#__PURE__*/React__default['default'].createElement(Cell.Cell, {
          key: id,
          content: content,
          contentType: columnContentTypes[cellIndex],
          firstColumn: cellIndex === 0,
          truncate: truncate,
          verticalAlign: verticalAlign,
          colSpan: colSpan
        });
      }));
    };

    this.defaultOnSort = headingIndex => {
      const {
        onSort,
        defaultSortDirection = 'ascending',
        initialSortColumnIndex
      } = this.props;
      const {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex
      } = this.state;
      let newSortDirection = defaultSortDirection;

      if (sortedColumnIndex === headingIndex) {
        newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
      }

      const handleSort = () => {
        this.setState({
          sortDirection: newSortDirection,
          sortedColumnIndex: headingIndex
        }, () => {
          if (onSort) {
            onSort(headingIndex, newSortDirection);
          }
        });
      };

      return handleSort;
    };
  }

  componentDidMount() {
    // We need to defer the calculation in development so the styles have time to be injected.
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.handleResize();
      }, 10);
    } else {
      this.handleResize();
    }
  }

  componentDidUpdate(prevProps) {
    if (isEqual__default['default'](prevProps, this.props)) {
      return;
    }

    this.handleResize();
  }

  componentWillUnmount() {
    this.handleResize.cancel();
  }

  render() {
    const {
      headings,
      totals,
      showTotalsInFooter,
      rows,
      footerContent,
      hideScrollIndicator = false
    } = this.props;
    const {
      condensed,
      columnVisibilityData,
      isScrolledFarthestLeft,
      isScrolledFarthestRight
    } = this.state;
    const className = css.classNames(DataTable$1['default'].DataTable, condensed && DataTable$1['default'].condensed);
    const wrapperClassName = css.classNames(DataTable$1['default'].TableWrapper, condensed && DataTable$1['default'].condensed);
    const headingMarkup = /*#__PURE__*/React__default['default'].createElement("tr", null, headings.map(this.renderHeadings));
    const totalsMarkup = totals ? /*#__PURE__*/React__default['default'].createElement("tr", null, totals.map(this.renderTotals)) : null;
    const bodyMarkup = rows.map(this.defaultRenderRow);
    const footerMarkup = footerContent ? /*#__PURE__*/React__default['default'].createElement("div", {
      className: DataTable$1['default'].Footer
    }, footerContent) : null;
    const headerTotalsMarkup = !showTotalsInFooter ? totalsMarkup : null;
    const footerTotalsMarkup = showTotalsInFooter ? /*#__PURE__*/React__default['default'].createElement("tfoot", null, totalsMarkup) : null;
    const navigationMarkup = hideScrollIndicator ? null : /*#__PURE__*/React__default['default'].createElement(Navigation.Navigation, {
      columnVisibilityData: columnVisibilityData,
      isScrolledFarthestLeft: isScrolledFarthestLeft,
      isScrolledFarthestRight: isScrolledFarthestRight,
      navigateTableLeft: this.navigateTable('left'),
      navigateTableRight: this.navigateTable('right')
    });
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: wrapperClassName
    }, navigationMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
      className: className,
      ref: this.dataTable
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: DataTable$1['default'].ScrollContainer,
      ref: this.scrollContainer
    }, /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "resize",
      handler: this.handleResize
    }), /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      capture: true,
      event: "scroll",
      handler: this.scrollListener
    }), /*#__PURE__*/React__default['default'].createElement("table", {
      className: DataTable$1['default'].Table,
      ref: this.table
    }, /*#__PURE__*/React__default['default'].createElement("thead", null, headingMarkup, headerTotalsMarkup), /*#__PURE__*/React__default['default'].createElement("tbody", null, bodyMarkup), footerTotalsMarkup)), footerMarkup));
  }

}

function DataTable(props) {
  const i18n = hooks.useI18n();
  return /*#__PURE__*/React__default['default'].createElement(DataTableInner, Object.assign({}, props, {
    i18n: i18n
  }));
}

exports.DataTable = DataTable;
