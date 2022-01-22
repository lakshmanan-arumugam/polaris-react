import React from 'react';
import { classNames } from '../../../../../../utilities/css.js';
import styles from './Title.scss.js';

function Title({
  title,
  subtitle,
  titleMetadata,
  thumbnail,
  compactTitle
}) {
  if (process.env.NODE_ENV === 'development' && thumbnail != null) {
    // eslint-disable-next-line no-console
    console.warn('The thumbnail prop from Page has been deprecated');
  }

  const titleMarkup = title ? /*#__PURE__*/React.createElement("h1", {
    className: styles.Title
  }, title) : null;
  const titleMetadataMarkup = titleMetadata ? /*#__PURE__*/React.createElement("div", {
    className: styles.TitleMetadata
  }, titleMetadata) : null;
  const wrappedTitleMarkup = titleMetadata ? /*#__PURE__*/React.createElement("div", {
    className: styles.TitleWithMetadataWrapper
  }, titleMarkup, titleMetadataMarkup) : titleMarkup;
  const subtitleMarkup = subtitle ? /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.SubTitle, compactTitle && styles.SubtitleCompact)
  }, /*#__PURE__*/React.createElement("p", null, subtitle)) : null;
  const thumbnailMarkup = thumbnail ? /*#__PURE__*/React.createElement("div", null, thumbnail) : null;
  const pageTitleClassName = thumbnail ? styles.hasThumbnail : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: pageTitleClassName
  }, thumbnailMarkup, /*#__PURE__*/React.createElement("div", {
    className: styles.TitleAndSubtitleWrapper
  }, wrappedTitleMarkup, subtitleMarkup));
}

export { Title };
