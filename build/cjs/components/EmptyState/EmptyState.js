'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var withinContentContext = require('../../utilities/within-content-context.js');
var EmptyState$1 = require('./EmptyState.scss.js');
var Image = require('../Image/Image.js');
var utils = require('../Button/utils.js');
var TextContainer = require('../TextContainer/TextContainer.js');
var Stack = require('../Stack/Stack.js');
var DisplayText = require('../DisplayText/DisplayText.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function EmptyState({
  children,
  heading,
  image,
  largeImage,
  imageContained,
  fullWidth = false,
  action,
  secondaryAction,
  footerContent
}) {
  const withinContentContainer = React.useContext(withinContentContext.WithinContentContext);
  const className = css.classNames(EmptyState$1['default'].EmptyState, fullWidth && EmptyState$1['default'].fullWidth, imageContained && EmptyState$1['default'].imageContained, withinContentContainer && EmptyState$1['default'].withinContentContainer);
  const imageMarkup = largeImage ? /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    alt: "",
    role: "presentation",
    className: EmptyState$1['default'].Image,
    source: largeImage,
    sourceSet: [{
      source: image,
      descriptor: '568w'
    }, {
      source: largeImage,
      descriptor: '1136w'
    }],
    sizes: "(max-width: 568px) 60vw"
  }) : /*#__PURE__*/React__default['default'].createElement(Image.Image, {
    role: "presentation",
    alt: "",
    className: EmptyState$1['default'].Image,
    source: image
  });
  const secondaryActionMarkup = secondaryAction ? utils.buttonFrom(secondaryAction, {}) : null;
  const footerContentMarkup = footerContent ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].FooterContent
  }, /*#__PURE__*/React__default['default'].createElement(TextContainer.TextContainer, null, footerContent)) : null;
  const headingSize = withinContentContainer ? 'small' : 'medium';
  const primaryActionMarkup = action ? utils.buttonFrom(action, {
    primary: true,
    size: 'medium'
  }) : null;
  const headingMarkup = heading ? /*#__PURE__*/React__default['default'].createElement(DisplayText.DisplayText, {
    size: headingSize
  }, heading) : null;
  const childrenMarkup = children ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].Content
  }, children) : null;
  const textContentMarkup = headingMarkup || children ? /*#__PURE__*/React__default['default'].createElement(TextContainer.TextContainer, null, headingMarkup, childrenMarkup) : null;
  const actionsMarkup = primaryActionMarkup || secondaryActionMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].Actions
  }, /*#__PURE__*/React__default['default'].createElement(Stack.Stack, {
    alignment: "center",
    distribution: "center",
    spacing: "tight"
  }, primaryActionMarkup, secondaryActionMarkup)) : null;
  const detailsMarkup = textContentMarkup || actionsMarkup || footerContentMarkup ? /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].DetailsContainer
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].Details
  }, textContentMarkup, actionsMarkup, footerContentMarkup)) : /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].DetailsContainer
  });
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: className
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].Section
  }, detailsMarkup, /*#__PURE__*/React__default['default'].createElement("div", {
    className: EmptyState$1['default'].ImageContainer
  }, imageMarkup)));
}

exports.EmptyState = EmptyState;
