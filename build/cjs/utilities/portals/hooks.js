'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var context = require('./context.js');

function usePortalsManager() {
  const portalsManager = React.useContext(context.PortalsManagerContext);

  if (!portalsManager) {
    throw new Error('No portals manager was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/structure/app-provider for implementation instructions.');
  }

  return portalsManager;
}

exports.usePortalsManager = usePortalsManager;
