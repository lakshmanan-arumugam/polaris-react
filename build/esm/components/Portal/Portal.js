import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePortalsManager } from '../../utilities/portals/hooks.js';
import { useUniqueId } from '../../utilities/unique-id/hooks.js';

function Portal({
  children,
  idPrefix = '',
  onPortalCreated = noop
}) {
  const {
    container
  } = usePortalsManager();
  const uniqueId = useUniqueId('portal');
  const portalId = idPrefix !== '' ? `${idPrefix}-${uniqueId}` : uniqueId;
  useEffect(() => {
    onPortalCreated();
  }, [onPortalCreated]);
  return container ? /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement("div", {
    "data-portal-id": portalId
  }, children), container) : null;
}

function noop() {}

export { Portal };
