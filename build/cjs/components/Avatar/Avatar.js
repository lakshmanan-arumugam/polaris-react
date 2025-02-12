'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var useIsAfterInitialMount = require('../../utilities/use-is-after-initial-mount.js');
var Avatar$1 = require('./Avatar.scss.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Image = require('../Image/Image.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  const i18n = hooks.useI18n();
  const isAfterInitialMount = useIsAfterInitialMount.useIsAfterInitialMount();

  function styleClass(name) {
    return name ? STYLE_CLASSES[name.charCodeAt(0) % STYLE_CLASSES.length] : STYLE_CLASSES[0];
  }

  const [status, setStatus] = React.useState(Status.Pending); // If the source changes, set the status back to pending

  React.useEffect(() => {
    setStatus(Status.Pending);
  }, [source]);
  const handleError = React.useCallback(() => {
    setStatus(Status.Errored);

    if (onError) {
      onError();
    }
  }, [onError]);
  const handleLoad = React.useCallback(() => {
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

  const className = css.classNames(Avatar$1['default'].Avatar, size && Avatar$1['default'][css.variationName('size', size)], !customer && Avatar$1['default'][css.variationName('style', styleClass(nameString))], (hasImage || initials && initials.length === 0) && status !== Status.Loaded && Avatar$1['default'].hidden, hasImage && Avatar$1['default'].hasImage);
  const imageMarkUp = source && isAfterInitialMount && status !== Status.Errored ? /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    className: Avatar$1['default'].Image,
    source: source,
    alt: "",
    role: "presentation",
    onLoad: handleLoad,
    onError: handleError
  }) : null; // Use `dominant-baseline: central` instead of `dy` when Edge supports it.

  const verticalOffset = '0.35em';
  const avatarBody = customer || !initials ? /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    d: "M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"
  }) : /*#__PURE__*/React__default['default'].createElement("text", {
    x: "50%",
    y: "50%",
    dy: verticalOffset,
    fill: "currentColor",
    fontSize: "20",
    textAnchor: "middle"
  }, initials);
  const svgMarkup = !hasImage ? /*#__PURE__*/React__default['default'].createElement("span", {
    className: Avatar$1['default'].Initials
  }, /*#__PURE__*/React__default['default'].createElement("svg", {
    className: Avatar$1['default'].Svg,
    viewBox: "0 0 40 40"
  }, avatarBody)) : null;
  return /*#__PURE__*/React__default['default'].createElement("span", {
    "aria-label": label,
    role: "img",
    className: className
  }, svgMarkup, imageMarkUp);
}

exports.Avatar = Avatar;
exports.STYLE_CLASSES = STYLE_CLASSES;
