import React from 'react';
import { classNames, variationName } from '../../utilities/css.js';
import styles from './Icon.scss.js';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.js';

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

  const className = classNames(styles.Icon, color && styles[variationName('color', color)], color && styles.applyColor, backdrop && styles.hasBackdrop);
  const SourceComponent = source;
  const contentMarkup = {
    function: /*#__PURE__*/React.createElement(SourceComponent, {
      className: styles.Svg,
      focusable: "false",
      "aria-hidden": "true"
    }),
    placeholder: /*#__PURE__*/React.createElement("div", {
      className: styles.Placeholder
    }),
    external: /*#__PURE__*/React.createElement("img", {
      className: styles.Img,
      src: `data:image/svg+xml;utf8,${source}`,
      alt: "",
      "aria-hidden": "true"
    })
  };
  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, /*#__PURE__*/React.createElement(VisuallyHidden, null, accessibilityLabel), contentMarkup[sourceType]);
}

export { Icon };
