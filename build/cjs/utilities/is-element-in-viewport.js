'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isElementInViewport(element) {
  const {
    top,
    left,
    bottom,
    right
  } = element.getBoundingClientRect();
  return top >= 0 && right <= window.innerWidth && bottom <= window.innerHeight && left >= 0;
}

exports.isElementInViewport = isElementInViewport;
