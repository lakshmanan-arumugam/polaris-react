import { memo, useEffect } from 'react';
import { useFrame } from '../../utilities/frame/hooks.js';

// that the interface defining the props is defined in this file, not imported
// from elsewhere. This silly workaround ensures that the Props Explorer table
// is generated correctly.

const ContextualSaveBar = /*#__PURE__*/memo(function ContextualSaveBar({
  message,
  saveAction,
  discardAction,
  alignContentFlush,
  fullWidth,
  contextControl
}) {
  const {
    setContextualSaveBar,
    removeContextualSaveBar
  } = useFrame();
  useEffect(() => {
    setContextualSaveBar({
      message,
      saveAction,
      discardAction,
      alignContentFlush,
      fullWidth,
      contextControl
    });
  }, [message, saveAction, discardAction, alignContentFlush, setContextualSaveBar, fullWidth, contextControl]);
  useEffect(() => {
    return removeContextualSaveBar;
  }, [removeContextualSaveBar]);
  return null;
});

export { ContextualSaveBar };
