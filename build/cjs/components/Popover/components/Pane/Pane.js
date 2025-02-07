'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../../../utilities/css.js');
var components = require('../../../../utilities/components.js');
var Popover = require('../../Popover.scss.js');
var Section = require('../Section/Section.js');
var Scrollable = require('../../../Scrollable/Scrollable.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Pane({
  fixed,
  sectioned,
  children,
  onScrolledToBottom
}) {
  const className = css.classNames(Popover['default'].Pane, fixed && Popover['default']['Pane-fixed']);
  const content = sectioned ? components.wrapWithComponent(children, Section.Section, {}) : children;
  return fixed ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, content) : /*#__PURE__*/React__default['default'].createElement(Scrollable.Scrollable, {
    shadow: true,
    className: className,
    onScrolledToBottom: onScrolledToBottom
  }, content);
}

exports.Pane = Pane;
