'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class MissingAppProviderError extends Error {
  constructor(message = '') {
    super(`${message ? `${message} ` : message}Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/structure/app-provider for implementation instructions.`);
    this.name = 'MissingAppProviderError';
  }

}

exports.MissingAppProviderError = MissingAppProviderError;
