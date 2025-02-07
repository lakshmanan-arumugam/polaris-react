'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var ActionMenu$1 = require('./ActionMenu.scss.js');
var RollupActions = require('./components/RollupActions/RollupActions.js');
var Actions = require('./components/Actions/Actions.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function ActionMenu({
  actions = [],
  groups = [],
  rollup,
  rollupActionsLabel
}) {
  if (actions.length === 0 && groups.length === 0) {
    return null;
  }

  const actionMenuClassNames = css.classNames(ActionMenu$1['default'].ActionMenu, rollup && ActionMenu$1['default'].rollup);
  const rollupSections = groups.map(group => convertGroupToSection(group));
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: actionMenuClassNames
  }, rollup ? /*#__PURE__*/React__default['default'].createElement(RollupActions.RollupActions, {
    accessibilityLabel: rollupActionsLabel,
    items: actions,
    sections: rollupSections
  }) : /*#__PURE__*/React__default['default'].createElement(Actions.Actions, {
    actions: actions,
    groups: groups
  }));
}
function hasGroupsWithActions(groups = []) {
  return groups.length === 0 ? false : groups.some(group => group.actions.length > 0);
}

function convertGroupToSection({
  title,
  actions
}) {
  return {
    title,
    items: actions
  };
}

exports.ActionMenu = ActionMenu;
exports.hasGroupsWithActions = hasGroupsWithActions;
