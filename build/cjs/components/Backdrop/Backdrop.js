'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Backdrop$1 = require('./Backdrop.scss.js');
var ScrollLock = require('../ScrollLock/ScrollLock.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Backdrop(props) {
  const {
    onClick,
    onTouchStart,
    belowNavigation,
    transparent
  } = props;
  const className = css.classNames(Backdrop$1['default'].Backdrop, belowNavigation && Backdrop$1['default'].belowNavigation, transparent && Backdrop$1['default'].transparent);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(ScrollLock.ScrollLock, null), /*#__PURE__*/React__default['default'].createElement("div", {
    className: className,
    onClick: onClick,
    onTouchStart: onTouchStart
  }));
}

exports.Backdrop = Backdrop;
