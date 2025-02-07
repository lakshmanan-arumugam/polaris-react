import React from 'react';
import styles from './SkeletonBodyText.scss.js';

function SkeletonBodyText({
  lines = 3
}) {
  const bodyTextLines = [];

  for (let i = 0; i < lines; i++) {
    bodyTextLines.push( /*#__PURE__*/React.createElement("div", {
      className: styles.SkeletonBodyText,
      key: i
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, bodyTextLines);
}

export { SkeletonBodyText };
