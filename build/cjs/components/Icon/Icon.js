'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Icon$1 = require('./Icon.scss.js');
var VisuallyHidden = require('../VisuallyHidden/VisuallyHidden.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const COLORS_WITH_BACKDROPS = ['base', 'critical', 'highlight', 'success', 'warning'];
function Icon({
  source,
  color,
  backdrop,
  accessibilityLabel
}) {
  let sourceType;

  if (typeof source === 'function') {
    sourceType = 'function';
  } else if (source === 'placeholder') {
    sourceType = 'placeholder';
  } else {
    sourceType = 'external';
  }

  if (color && sourceType === 'external' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('Recoloring external SVGs is not supported. Set the intended color on your SVG instead.');
  }

  if (backdrop && color && !COLORS_WITH_BACKDROPS.includes(color) && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(`The ${color} variant does not have a supported backdrop color`);
  }

  const className = css.classNames(Icon$1['default'].Icon, color && Icon$1['default'][css.variationName('color', color)], color && Icon$1['default'].applyColor, backdrop && Icon$1['default'].hasBackdrop);
  const SourceComponent = source;
  const contentMarkup = {
    function: /*#__PURE__*/React__default['default'].createElement(SourceComponent, {
      className: Icon$1['default'].Svg,
      focusable: "false",
      "aria-hidden": "true"
    }),
    placeholder: /*#__PURE__*/React__default['default'].createElement("div", {
      className: Icon$1['default'].Placeholder
    }),
    external: /*#__PURE__*/React__default['default'].createElement("img", {
      className: Icon$1['default'].Img,
      src: `data:image/svg+xml;utf8,${source}`,
      alt: "",
      "aria-hidden": "true"
    })
  };
  return /*#__PURE__*/React__default['default'].createElement("span", {
    className: className
  }, /*#__PURE__*/React__default['default'].createElement(VisuallyHidden.VisuallyHidden, null, accessibilityLabel), contentMarkup[sourceType]);
}

exports.Icon = Icon;
