'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var options = require('../../utilities/options.js');
var Autocomplete$1 = require('./Autocomplete.scss.js');
var MappedOption = require('./components/MappedOption/MappedOption.js');
var Combobox = require('../Combobox/Combobox.js');
var MappedAction = require('./components/MappedAction/MappedAction.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Listbox = require('../Listbox/Listbox.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
const Autocomplete = function Autocomplete({
  options: options$1,
  selected,
  textField,
  preferredPosition,
  listTitle,
  allowMultiple,
  loading,
  actionBefore,
  willLoadMoreResults,
  emptyState,
  onSelect,
  onLoadMoreResults
}) {
  const i18n = hooks.useI18n();
  const buildMappedOptionFromOption = React.useCallback(options => {
    return options.map(option => /*#__PURE__*/React__default['default'].createElement(MappedOption.MappedOption, Object.assign({
      key: option.id || option.value
    }, option, {
      selected: selected.includes(option.value),
      singleSelection: !allowMultiple
    })));
  }, [selected, allowMultiple]);
  const optionsMarkup = React.useMemo(() => {
    const conditionalOptions = loading && !willLoadMoreResults ? [] : options$1;

    if (options.isSection(conditionalOptions)) {
      const noOptionsAvailable = conditionalOptions.every(({
        options
      }) => options.length === 0);

      if (noOptionsAvailable) {
        return null;
      }

      const optionsMarkup = conditionalOptions.map(({
        options,
        title
      }) => {
        if (options.length === 0) {
          return null;
        }

        const optionMarkup = buildMappedOptionFromOption(options);
        return /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Section, {
          divider: false,
          title: /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Header, null, title),
          key: title
        }, optionMarkup);
      });
      return /*#__PURE__*/React__default['default'].createElement("div", {
        className: Autocomplete$1['default'].SectionWrapper
      }, optionsMarkup);
    }

    const optionList = conditionalOptions.length > 0 ? buildMappedOptionFromOption(conditionalOptions) : null;

    if (listTitle) {
      return /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Section, {
        divider: false,
        title: /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Header, null, listTitle)
      }, optionList);
    }

    return optionList;
  }, [listTitle, loading, options$1, willLoadMoreResults, buildMappedOptionFromOption]);
  const loadingMarkup = loading ? /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox.Loading, {
    accessibilityLabel: i18n.translate('Polaris.Autocomplete.spinnerAccessibilityLabel')
  }) : null;
  const updateSelection = React.useCallback(newSelection => {
    if (allowMultiple) {
      if (selected.includes(newSelection)) {
        onSelect(selected.filter(option => option !== newSelection));
      } else {
        onSelect([...selected, newSelection]);
      }
    } else {
      onSelect([newSelection]);
    }
  }, [allowMultiple, onSelect, selected]);
  const actionMarkup = actionBefore && /*#__PURE__*/React__default['default'].createElement(MappedAction.MappedAction, actionBefore);
  const emptyStateMarkup = emptyState && options$1.length < 1 && !loading && /*#__PURE__*/React__default['default'].createElement("div", {
    role: "status"
  }, emptyState);
  return /*#__PURE__*/React__default['default'].createElement(Combobox.Combobox, {
    activator: textField,
    allowMultiple: allowMultiple,
    onScrolledToBottom: onLoadMoreResults,
    preferredPosition: preferredPosition
  }, actionMarkup || optionsMarkup || loadingMarkup || emptyStateMarkup ? /*#__PURE__*/React__default['default'].createElement(Listbox.Listbox, {
    onSelect: updateSelection
  }, actionMarkup, optionsMarkup && (!loading || willLoadMoreResults) ? optionsMarkup : null, loadingMarkup, emptyStateMarkup) : null);
};
Autocomplete.TextField = Combobox.Combobox.TextField;

exports.Autocomplete = Autocomplete;
