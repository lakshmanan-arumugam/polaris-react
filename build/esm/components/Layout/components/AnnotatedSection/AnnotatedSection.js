import React from 'react';
import styles from '../../Layout.scss.js';
import { TextContainer } from '../../../TextContainer/TextContainer.js';
import { Heading } from '../../../Heading/Heading.js';

function AnnotatedSection(props) {
  const {
    children,
    title,
    description,
    id
  } = props;
  const descriptionMarkup = typeof description === 'string' ? /*#__PURE__*/React.createElement("p", null, description) : description;
  return /*#__PURE__*/React.createElement("div", {
    className: styles.AnnotatedSection
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.AnnotationWrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Annotation
  }, /*#__PURE__*/React.createElement(TextContainer, null, /*#__PURE__*/React.createElement(Heading, {
    id: id
  }, title), descriptionMarkup && /*#__PURE__*/React.createElement("div", {
    className: styles.AnnotationDescription
  }, descriptionMarkup))), /*#__PURE__*/React.createElement("div", {
    className: styles.AnnotationContent
  }, children)));
}

export { AnnotatedSection };
