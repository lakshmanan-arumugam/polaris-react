import React, { useState, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { navigationBarCollapsed } from '../../utilities/breakpoints.js';
import { MediaQueryContext } from '../../utilities/media-query/context.js';
import { EventListener } from '../EventListener/EventListener.js';

const MediaQueryProvider = function MediaQueryProvider({
  children
}) {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(navigationBarCollapsed().matches); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleResize = useCallback(debounce(() => {
    if (isNavigationCollapsed !== navigationBarCollapsed().matches) {
      setIsNavigationCollapsed(!isNavigationCollapsed);
    }
  }, 40, {
    trailing: true,
    leading: true,
    maxWait: 40
  }), [isNavigationCollapsed]);
  useEffect(() => {
    setIsNavigationCollapsed(navigationBarCollapsed().matches);
  }, []);
  const context = useMemo(() => ({
    isNavigationCollapsed
  }), [isNavigationCollapsed]);
  return /*#__PURE__*/React.createElement(MediaQueryContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(EventListener, {
    event: "resize",
    handler: handleResize
  }), children);
};

export { MediaQueryProvider };
