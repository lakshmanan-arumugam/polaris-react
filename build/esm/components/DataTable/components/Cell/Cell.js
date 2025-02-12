import React from 'react';
import { CaretDownMinor, CaretUpMinor } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../../../utilities/css.js';
import { headerCell } from '../../../shared.js';
import styles from '../../DataTable.scss.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { Icon } from '../../../Icon/Icon.js';

function Cell({
  content,
  contentType,
  firstColumn,
  truncate,
  header,
  total,
  totalInFooter,
  sorted,
  sortable,
  sortDirection,
  verticalAlign = 'top',
  defaultSortDirection = 'ascending',
  onSort,
  colSpan
}) {
  const i18n = useI18n();
  const numeric = contentType === 'numeric';
  const className = classNames(styles.Cell, styles[`Cell-${variationName('verticalAlign', verticalAlign)}`], firstColumn && styles['Cell-firstColumn'], firstColumn && truncate && styles['Cell-truncated'], header && styles['Cell-header'], total && styles['Cell-total'], totalInFooter && styles['Cell-total-footer'], numeric && styles['Cell-numeric'], sortable && styles['Cell-sortable'], sorted && styles['Cell-sorted']);
  const headerClassName = classNames(header && styles.Heading, header && contentType === 'text' && styles['Heading-left']);
  const iconClassName = classNames(sortable && styles.Icon);
  const direction = sorted && sortDirection ? sortDirection : defaultSortDirection;
  const source = direction === 'descending' ? CaretDownMinor : CaretUpMinor;
  const oppositeDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
  const sortAccessibilityLabel = i18n.translate('Polaris.DataTable.sortAccessibilityLabel', {
    direction: sorted ? oppositeDirection : direction
  });
  const iconMarkup = /*#__PURE__*/React.createElement("span", {
    className: iconClassName
  }, /*#__PURE__*/React.createElement(Icon, {
    source: source,
    accessibilityLabel: sortAccessibilityLabel
  }));
  const sortableHeadingContent = /*#__PURE__*/React.createElement("button", {
    className: headerClassName,
    onClick: onSort
  }, iconMarkup, content);
  const columnHeadingContent = sortable ? sortableHeadingContent : content;
  const colSpanProp = colSpan && colSpan > 1 ? {
    colSpan
  } : {};
  const headingMarkup = header ? /*#__PURE__*/React.createElement("th", Object.assign({}, headerCell.props, colSpanProp, {
    className: className,
    scope: "col",
    "aria-sort": sortDirection
  }), columnHeadingContent) : /*#__PURE__*/React.createElement("th", Object.assign({
    className: className,
    scope: "row"
  }, colSpanProp), content);
  const cellMarkup = header || firstColumn ? headingMarkup : /*#__PURE__*/React.createElement("td", Object.assign({
    className: className
  }, colSpanProp), content);
  return cellMarkup;
}

export { Cell };
