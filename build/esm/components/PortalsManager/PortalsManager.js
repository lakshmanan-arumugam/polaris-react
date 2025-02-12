import React, { useState, useMemo } from 'react';
import { PortalsManagerContext } from '../../utilities/portals/context.js';
import { PortalsContainer } from './components/PortalsContainer/PortalsContainer.js';

function PortalsManager({
  children,
  container
}) {
  const [portalContainerElement, setPortalContainerElement] = useState(null);
  const currentContainer = container !== null && container !== void 0 ? container : portalContainerElement;
  const contextValue = useMemo(() => ({
    container: currentContainer
  }), [currentContainer]);
  return /*#__PURE__*/React.createElement(PortalsManagerContext.Provider, {
    value: contextValue
  }, children, container ? null : /*#__PURE__*/React.createElement(PortalsContainer, {
    ref: setPortalContainerElement
  }));
}

export { PortalsManager };
