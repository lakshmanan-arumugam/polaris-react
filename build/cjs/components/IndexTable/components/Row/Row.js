'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useToggle = require('../../../../utilities/use-toggle.js');
var css = require('../../../../utilities/css.js');
var IndexTable = require('../../IndexTable.scss.js');
var hooks = require('../../../../utilities/index-provider/hooks.js');
var types = require('../../../../utilities/index-provider/types.js');
var Checkbox = require('../Checkbox/Checkbox.js');
var context = require('../../../../utilities/index-table/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const Row = /*#__PURE__*/React.memo(function Row({
  children,
  selected,
  id,
  position,
  subdued,
  status,
  onNavigation
}) {
  const {
    selectable,
    selectMode,
    condensed
  } = hooks.useIndexRow();
  const onSelectionChange = hooks.useIndexSelectionChange();
  const {
    value: hovered,
    setTrue: setHoverIn,
    setFalse: setHoverOut
  } = useToggle.useToggle(false);
  const handleInteraction = React.useCallback(event => {
    event.stopPropagation();
    if ('key' in event && event.key !== ' ' || !onSelectionChange) return;
    const selectionType = event.nativeEvent.shiftKey ? types.SelectionType.Multi : types.SelectionType.Single;
    onSelectionChange(selectionType, !selected, id, position);
  }, [id, onSelectionChange, position, selected]);
  const contextValue = React.useMemo(() => ({
    itemId: id,
    selected,
    onInteraction: handleInteraction
  }), [id, selected, handleInteraction]);
  const primaryLinkElement = React.useRef(null);
  const isNavigating = React.useRef(false);
  const tableRowRef = React.useRef(null);
  const tableRowCallbackRef = React.useCallback(node => {
    tableRowRef.current = node;
    const el = node === null || node === void 0 ? void 0 : node.querySelector('[data-primary-link]');

    if (el) {
      primaryLinkElement.current = el;
    }
  }, []);
  const rowClassName = css.classNames(IndexTable['default'].TableRow, selectable && condensed && IndexTable['default'].condensedRow, selected && IndexTable['default']['TableRow-selected'], subdued && IndexTable['default']['TableRow-subdued'], hovered && IndexTable['default']['TableRow-hovered'], status && IndexTable['default'][css.variationName('status', status)], !selectable && !primaryLinkElement.current && IndexTable['default']['TableRow-unclickable']);
  let handleRowClick;

  if (selectable || primaryLinkElement.current) {
    handleRowClick = event => {
      if (!tableRowRef.current || isNavigating.current) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (primaryLinkElement.current && !selectMode) {
        isNavigating.current = true;
        const {
          ctrlKey,
          metaKey
        } = event.nativeEvent;

        if (onNavigation) {
          onNavigation(id);
        }

        if ((ctrlKey || metaKey) && primaryLinkElement.current instanceof HTMLAnchorElement) {
          isNavigating.current = false;
          window.open(primaryLinkElement.current.href, '_blank');
          return;
        }

        primaryLinkElement.current.dispatchEvent(new MouseEvent(event.type, event.nativeEvent));
      } else {
        isNavigating.current = false;
        handleInteraction(event);
      }
    };
  }

  const RowWrapper = condensed ? 'li' : 'tr';
  const checkboxMarkup = selectable ? /*#__PURE__*/React__default['default'].createElement(Checkbox.Checkbox, null) : null;
  return /*#__PURE__*/React__default['default'].createElement(context.RowContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React__default['default'].createElement(context.RowHoveredContext.Provider, {
    value: hovered
  }, /*#__PURE__*/React__default['default'].createElement(RowWrapper, {
    key: id,
    className: rowClassName,
    onMouseEnter: setHoverIn,
    onMouseLeave: setHoverOut,
    onClick: handleRowClick,
    ref: tableRowCallbackRef
  }, checkboxMarkup, children)));
});

exports.Row = Row;
