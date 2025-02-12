import React from 'react';
import { classNames } from '../../utilities/css.js';
import styles from './Page.scss.js';
import { Header } from './components/Header/Header.js';

function Page({
  children,
  fullWidth,
  narrowWidth,
  divider,
  ...rest
}) {
  const pageClassName = classNames(styles.Page, fullWidth && styles.fullWidth, narrowWidth && styles.narrowWidth);
  const hasHeaderContent = rest.title != null && rest.title !== '' || rest.primaryAction != null || rest.secondaryActions != null && rest.secondaryActions.length > 0 || rest.actionGroups != null && rest.actionGroups.length > 0 || rest.breadcrumbs != null && rest.breadcrumbs.length > 0;
  const contentClassName = classNames(styles.Content, divider && hasHeaderContent && styles.divider);
  const headerMarkup = hasHeaderContent ? /*#__PURE__*/React.createElement(Header, rest) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: pageClassName
  }, headerMarkup, /*#__PURE__*/React.createElement("div", {
    className: contentClassName
  }, children));
}

export { Page };
