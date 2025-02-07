import React, { useRef, useContext, useEffect } from 'react';
import { ScrollableContext } from '../../context.js';
import { useUniqueId } from '../../../../utilities/unique-id/hooks.js';

function ScrollTo() {
  const anchorNode = useRef(null);
  const scrollToPosition = useContext(ScrollableContext);
  useEffect(() => {
    if (!scrollToPosition || !anchorNode.current) {
      return;
    }

    scrollToPosition(anchorNode.current.offsetTop);
  }, [scrollToPosition]);
  const id = useUniqueId(`ScrollTo`); // eslint-disable-next-line jsx-a11y/anchor-is-valid

  return /*#__PURE__*/React.createElement("a", {
    id: id,
    ref: anchorNode
  });
}

export { ScrollTo };
