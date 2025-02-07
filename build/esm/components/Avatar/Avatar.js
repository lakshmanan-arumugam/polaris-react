import React, { useState, useEffect, useCallback } from 'react';
import { classNames, variationName } from '../../utilities/css.js';
import { useIsAfterInitialMount } from '../../utilities/use-is-after-initial-mount.js';
import styles from './Avatar.scss.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Image } from '../Image/Image.js';

var Status;

(function (Status) {
  Status["Pending"] = "PENDING";
  Status["Loaded"] = "LOADED";
  Status["Errored"] = "ERRORED";
})(Status || (Status = {}));

const STYLE_CLASSES = ['one', 'two', 'three', 'four', 'five'];
function Avatar({
  name,
  source,
  onError,
  initials,
  customer,
  size = 'medium',
  accessibilityLabel
}) {
  const i18n = useI18n();
  const isAfterInitialMount = useIsAfterInitialMount();

  function styleClass(name) {
    return name ? STYLE_CLASSES[name.charCodeAt(0) % STYLE_CLASSES.length] : STYLE_CLASSES[0];
  }

  const [status, setStatus] = useState(Status.Pending); // If the source changes, set the status back to pending

  useEffect(() => {
    setStatus(Status.Pending);
  }, [source]);
  const handleError = useCallback(() => {
    setStatus(Status.Errored);

    if (onError) {
      onError();
    }
  }, [onError]);
  const handleLoad = useCallback(() => {
    setStatus(Status.Loaded);
  }, []);
  const hasImage = source && status !== Status.Errored;
  const nameString = name || initials;
  let label;

  if (accessibilityLabel) {
    label = accessibilityLabel;
  } else if (name) {
    label = name;
  } else if (initials) {
    const splitInitials = initials.split('').join(' ');
    label = i18n.translate('Polaris.Avatar.labelWithInitials', {
      initials: splitInitials
    });
  } else {
    label = i18n.translate('Polaris.Avatar.label');
  }

  const className = classNames(styles.Avatar, size && styles[variationName('size', size)], !customer && styles[variationName('style', styleClass(nameString))], (hasImage || initials && initials.length === 0) && status !== Status.Loaded && styles.hidden, hasImage && styles.hasImage);
  const imageMarkUp = source && isAfterInitialMount && status !== Status.Errored ? /*#__PURE__*/React.createElement(Image, {
    className: styles.Image,
    source: source,
    alt: "",
    role: "presentation",
    onLoad: handleLoad,
    onError: handleError
  }) : null; // Use `dominant-baseline: central` instead of `dy` when Edge supports it.

  const verticalOffset = '0.35em';
  const avatarBody = customer || !initials ? /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"
  }) : /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "50%",
    dy: verticalOffset,
    fill: "currentColor",
    fontSize: "20",
    textAnchor: "middle"
  }, initials);
  const svgMarkup = !hasImage ? /*#__PURE__*/React.createElement("span", {
    className: styles.Initials
  }, /*#__PURE__*/React.createElement("svg", {
    className: styles.Svg,
    viewBox: "0 0 40 40"
  }, avatarBody)) : null;
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": label,
    role: "img",
    className: className
  }, svgMarkup, imageMarkUp);
}

export { Avatar, STYLE_CLASSES };
