import React from 'react';
import { classNames } from '../../utilities/css.js';
import styles from './DescriptionList.scss.js';

function DescriptionList({
  items,
  spacing = 'loose'
}) {
  // There's no good key to give React so using the index is a last resport.
  // we can't use the term/description value as it may be a react component
  // which can't be stringified
  const terms = items.reduce((allTerms, {
    term,
    description
  }, index) => [...allTerms, /*#__PURE__*/React.createElement("dt", {
    key: `dt${index}`,
    className: styles.Term
  }, term), /*#__PURE__*/React.createElement("dd", {
    key: `dd${index}`,
    className: styles.Description
  }, description)], []);
  const className = classNames(styles.DescriptionList, spacing === 'tight' && styles.spacingTight);
  return /*#__PURE__*/React.createElement("dl", {
    className: className
  }, terms);
}

export { DescriptionList };
