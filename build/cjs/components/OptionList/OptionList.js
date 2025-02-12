'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var options = require('../../utilities/options.js');
var arrays = require('../../utilities/arrays.js');
var useDeepEffect = require('../../utilities/use-deep-effect.js');
var OptionList$1 = require('./OptionList.scss.js');
var Option = require('./components/Option/Option.js');
var hooks = require('../../utilities/unique-id/hooks.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function OptionList({
  options,
  sections,
  title,
  selected,
  allowMultiple,
  role,
  optionRole,
  verticalAlign,
  onChange,
  id: idProp
}) {
  const [normalizedOptions, setNormalizedOptions] = React.useState(createNormalizedOptions(options, sections, title));
  const id = hooks.useUniqueId('OptionList', idProp);
  useDeepEffect.useDeepEffect(() => {
    setNormalizedOptions(createNormalizedOptions(options || [], sections || [], title));
  }, [options, sections, title], optionArraysAreEqual);
  const handleClick = React.useCallback((sectionIndex, optionIndex) => {
    const selectedValue = normalizedOptions[sectionIndex].options[optionIndex].value;
    const foundIndex = selected.indexOf(selectedValue);

    if (allowMultiple) {
      const newSelection = foundIndex === -1 ? [selectedValue, ...selected] : [...selected.slice(0, foundIndex), ...selected.slice(foundIndex + 1, selected.length)];
      onChange(newSelection);
      return;
    }

    onChange([selectedValue]);
  }, [normalizedOptions, selected, allowMultiple, onChange]);
  const optionsExist = normalizedOptions.length > 0;
  const optionsMarkup = optionsExist ? normalizedOptions.map(({
    title,
    options
  }, sectionIndex) => {
    const titleMarkup = title ? /*#__PURE__*/React__default['default'].createElement("p", {
      className: OptionList$1['default'].Title
    }, title) : null;
    const optionsMarkup = options && options.map((option, optionIndex) => {
      const isSelected = selected.includes(option.value);
      const optionId = option.id || `${id}-${sectionIndex}-${optionIndex}`;
      return /*#__PURE__*/React__default['default'].createElement(Option.Option, Object.assign({
        key: optionId
      }, option, {
        id: optionId,
        section: sectionIndex,
        index: optionIndex,
        onClick: handleClick,
        select: isSelected,
        allowMultiple: allowMultiple,
        verticalAlign: verticalAlign,
        role: optionRole
      }));
    });
    return /*#__PURE__*/React__default['default'].createElement("li", {
      key: title || `noTitle-${sectionIndex}`
    }, titleMarkup, /*#__PURE__*/React__default['default'].createElement("ul", {
      className: OptionList$1['default'].Options,
      id: `${id}-${sectionIndex}`,
      role: role
    }, optionsMarkup));
  }) : null;
  return /*#__PURE__*/React__default['default'].createElement("ul", {
    className: OptionList$1['default'].OptionList,
    role: role
  }, optionsMarkup);
}

function createNormalizedOptions(options, sections, title) {
  if (options == null) {
    const section = {
      options: [],
      title
    };
    return sections == null ? [] : [section, ...sections];
  }

  if (sections == null) {
    return [{
      title,
      options
    }];
  }

  return [{
    title,
    options
  }, ...sections];
}

function optionArraysAreEqual(firstArray, secondArray) {
  if (options.isSection(firstArray) && options.isSection(secondArray)) {
    return arrays.arraysAreEqual(firstArray, secondArray, testSectionsPropEquality);
  }

  return arrays.arraysAreEqual(firstArray, secondArray);
}

function testSectionsPropEquality(previousSection, currentSection) {
  const {
    options: previousOptions
  } = previousSection;
  const {
    options: currentOptions
  } = currentSection;
  const optionsAreEqual = arrays.arraysAreEqual(previousOptions, currentOptions);
  const titlesAreEqual = previousSection.title === currentSection.title;
  return optionsAreEqual && titlesAreEqual;
}

exports.OptionList = OptionList;
