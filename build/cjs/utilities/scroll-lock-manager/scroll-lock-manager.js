'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var target = require('../target.js');

const SCROLL_LOCKING_ATTRIBUTE = 'data-lock-scrolling';
const SCROLL_LOCKING_WRAPPER_ATTRIBUTE = 'data-lock-scrolling-wrapper';
let scrollPosition = 0;
class ScrollLockManager {
  constructor() {
    this.scrollLocks = 0;
    this.locked = false;
  }

  registerScrollLock() {
    this.scrollLocks += 1;
    this.handleScrollLocking();
  }

  unregisterScrollLock() {
    this.scrollLocks -= 1;
    this.handleScrollLocking();
  }

  handleScrollLocking() {
    if (target.isServer) return;
    const {
      scrollLocks
    } = this;
    const {
      body
    } = document;
    const wrapper = body.firstElementChild;

    if (scrollLocks === 0) {
      body.removeAttribute(SCROLL_LOCKING_ATTRIBUTE);

      if (wrapper) {
        wrapper.removeAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE);
      }

      window.scroll(0, scrollPosition);
      this.locked = false;
    } else if (scrollLocks > 0 && !this.locked) {
      scrollPosition = window.pageYOffset;
      body.setAttribute(SCROLL_LOCKING_ATTRIBUTE, '');

      if (wrapper) {
        wrapper.setAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE, '');
        wrapper.scrollTop = scrollPosition;
      }

      this.locked = true;
    }
  }

  resetScrollPosition() {
    scrollPosition = 0;
  }

}

exports.SCROLL_LOCKING_ATTRIBUTE = SCROLL_LOCKING_ATTRIBUTE;
exports.ScrollLockManager = ScrollLockManager;
