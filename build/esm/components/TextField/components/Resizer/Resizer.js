import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import styles from '../../TextField.scss.js';
import { EventListener } from '../../../EventListener/EventListener.js';

function Resizer({
  contents,
  currentHeight: currentHeightProp = null,
  minimumLines,
  onHeightChange
}) {
  const contentNode = useRef(null);
  const minimumLinesNode = useRef(null);
  const animationFrame = useRef();
  const currentHeight = useRef(currentHeightProp);

  if (currentHeightProp !== currentHeight.current) {
    currentHeight.current = currentHeightProp;
  }

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);
  const minimumLinesMarkup = minimumLines ? /*#__PURE__*/React.createElement("div", {
    ref: minimumLinesNode,
    className: styles.DummyInput,
    dangerouslySetInnerHTML: {
      __html: getContentsForMinimumLines(minimumLines)
    }
  }) : null;
  const handleHeightCheck = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      if (!contentNode.current || !minimumLinesNode.current) {
        return;
      }

      const newHeight = Math.max(contentNode.current.offsetHeight, minimumLinesNode.current.offsetHeight);

      if (newHeight !== currentHeight.current) {
        onHeightChange(newHeight);
      }
    });
  }, [onHeightChange]);
  useLayoutEffect(() => {
    handleHeightCheck();
  });
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    className: styles.Resizer
  }, /*#__PURE__*/React.createElement(EventListener, {
    event: "resize",
    handler: handleHeightCheck
  }), /*#__PURE__*/React.createElement("div", {
    ref: contentNode,
    className: styles.DummyInput,
    dangerouslySetInnerHTML: {
      __html: getFinalContents(contents)
    }
  }), minimumLinesMarkup);
}
const ENTITIES_TO_REPLACE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\n': '<br>',
  '\r': ''
};
const REPLACE_REGEX = new RegExp(`[${Object.keys(ENTITIES_TO_REPLACE).join()}]`, 'g');

function replaceEntity(entity) {
  return ENTITIES_TO_REPLACE[entity];
}

function getContentsForMinimumLines(minimumLines) {
  let content = '';

  for (let line = 0; line < minimumLines; line++) {
    content += '<br>';
  }

  return content;
}

function getFinalContents(contents) {
  return contents ? `${contents.replace(REPLACE_REGEX, replaceEntity)}<br>` : '<br>';
}

export { Resizer };
