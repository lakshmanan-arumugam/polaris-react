import React, { useContext } from 'react';
import { classNames } from '../../utilities/css.js';
import { WithinContentContext } from '../../utilities/within-content-context.js';
import styles from './EmptyState.scss.js';
import { Image } from '../Image/Image.js';
import { buttonFrom } from '../Button/utils.js';
import { TextContainer } from '../TextContainer/TextContainer.js';
import { Stack } from '../Stack/Stack.js';
import { DisplayText } from '../DisplayText/DisplayText.js';

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
  const withinContentContainer = useContext(WithinContentContext);
  const className = classNames(styles.EmptyState, fullWidth && styles.fullWidth, imageContained && styles.imageContained, withinContentContainer && styles.withinContentContainer);
  const imageMarkup = largeImage ? /*#__PURE__*/React.createElement(Image, {
    alt: "",
    role: "presentation",
    className: styles.Image,
    source: largeImage,
    sourceSet: [{
      source: image,
      descriptor: '568w'
    }, {
      source: largeImage,
      descriptor: '1136w'
    }],
    sizes: "(max-width: 568px) 60vw"
  }) : /*#__PURE__*/React.createElement(Image, {
    role: "presentation",
    alt: "",
    className: styles.Image,
    source: image
  });
  const secondaryActionMarkup = secondaryAction ? buttonFrom(secondaryAction, {}) : null;
  const footerContentMarkup = footerContent ? /*#__PURE__*/React.createElement("div", {
    className: styles.FooterContent
  }, /*#__PURE__*/React.createElement(TextContainer, null, footerContent)) : null;
  const headingSize = withinContentContainer ? 'small' : 'medium';
  const primaryActionMarkup = action ? buttonFrom(action, {
    primary: true,
    size: 'medium'
  }) : null;
  const headingMarkup = heading ? /*#__PURE__*/React.createElement(DisplayText, {
    size: headingSize
  }, heading) : null;
  const childrenMarkup = children ? /*#__PURE__*/React.createElement("div", {
    className: styles.Content
  }, children) : null;
  const textContentMarkup = headingMarkup || children ? /*#__PURE__*/React.createElement(TextContainer, null, headingMarkup, childrenMarkup) : null;
  const actionsMarkup = primaryActionMarkup || secondaryActionMarkup ? /*#__PURE__*/React.createElement("div", {
    className: styles.Actions
  }, /*#__PURE__*/React.createElement(Stack, {
    alignment: "center",
    distribution: "center",
    spacing: "tight"
  }, primaryActionMarkup, secondaryActionMarkup)) : null;
  const detailsMarkup = textContentMarkup || actionsMarkup || footerContentMarkup ? /*#__PURE__*/React.createElement("div", {
    className: styles.DetailsContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Details
  }, textContentMarkup, actionsMarkup, footerContentMarkup)) : /*#__PURE__*/React.createElement("div", {
    className: styles.DetailsContainer
  });
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Section
  }, detailsMarkup, /*#__PURE__*/React.createElement("div", {
    className: styles.ImageContainer
  }, imageMarkup)));
}

export { EmptyState };
