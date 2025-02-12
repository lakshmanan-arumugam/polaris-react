'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var ActionList = require('../../ActionList.scss.js');
var Item = require('../Item/Item.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Section({
  section,
  hasMultipleSections,
  actionRole,
  firstSection,
  onActionAnyItem
}) {
  const handleAction = itemOnAction => {
    return () => {
      if (itemOnAction) {
        itemOnAction();
      }

      if (onActionAnyItem) {
        onActionAnyItem();
      }
    };
  };

  const actionMarkup = section.items.map(({
    content,
    helpText,
    onAction,
    ...item
  }, index) => {
    return /*#__PURE__*/React__default['default'].createElement(Item.Item, Object.assign({
      key: `${content}-${index}`,
      content: content,
      helpText: helpText,
      role: actionRole,
      onAction: handleAction(onAction)
    }, item));
  });
  const className = section.title ? undefined : ActionList['default']['Section-withoutTitle'];
  const titleClassName = css.classNames(ActionList['default'].Title, firstSection && ActionList['default'].firstSectionWithTitle);
  const titleMarkup = section.title ? /*#__PURE__*/React__default['default'].createElement("p", {
    className: titleClassName
  }, section.title) : null;
  let sectionRole;

  switch (actionRole) {
    case 'option':
      sectionRole = 'presentation';
      break;

    case 'menuitem':
      sectionRole = !hasMultipleSections ? 'menu' : 'presentation';
      break;

    default:
      sectionRole = undefined;
      break;
  }

  const sectionMarkup = /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, titleMarkup, /*#__PURE__*/React__default['default'].createElement("ul", {
    className: ActionList['default'].Actions,
    role: sectionRole,
    tabIndex: !hasMultipleSections ? -1 : undefined
  }, actionMarkup));
  return hasMultipleSections ? /*#__PURE__*/React__default['default'].createElement("li", {
    className: ActionList['default'].Section,
    role: "presentation"
  }, sectionMarkup) : sectionMarkup;
}

exports.Section = Section;
