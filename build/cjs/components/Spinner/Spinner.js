'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var useIsAfterInitialMount = require('../../utilities/use-is-after-initial-mount.js');
var Spinner$1 = require('./Spinner.scss.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Spinner({
  size = 'large',
  accessibilityLabel,
  hasFocusableParent
}) {
  const isAfterInitialMount = useIsAfterInitialMount.useIsAfterInitialMount();
  const className = css.classNames(Spinner$1['default'].Spinner, size && Spinner$1['default'][css.variationName('size', size)]);
  const spinnerSVGMarkup = size === 'large' ? /*#__PURE__*/React__default['default'].createElement("svg", {
    viewBox: "0 0 44 44",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default['default'].createElement("path", {
    d: "M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"
  })) : /*#__PURE__*/React__default['default'].createElement("svg", {
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default['default'].createElement("path", {
    d: "M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
  }));
  const spanAttributes = { ...(!hasFocusableParent && {
      role: 'status'
    })
  };
  const accessibilityLabelMarkup = (isAfterInitialMount || !hasFocusableParent) && /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, accessibilityLabel);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement("span", {
    className: className
  }, spinnerSVGMarkup), /*#__PURE__*/React__default['default'].createElement("span", spanAttributes, accessibilityLabelMarkup));
}

exports.Spinner = Spinner;
