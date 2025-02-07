import React, { memo, useEffect } from 'react';
import { focusFirstFocusableNode } from '../../utilities/focus.js';

const Focus = /*#__PURE__*/memo(function Focus({
  children,
  disabled,
  root
}) {
  useEffect(() => {
    if (disabled || !root) {
      return;
    }

    const node = isRef(root) ? root.current : root;

    if (!node || node.querySelector('[autofocus]')) {
      return;
    }

    focusFirstFocusableNode(node, false);
  }, [disabled, root]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
});

function isRef(ref) {
  return ref.current !== undefined;
}

export { Focus };
