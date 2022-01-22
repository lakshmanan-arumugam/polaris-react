'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var css = require('../../utilities/css.js');
var shared = require('../shared.js');
var context = require('./context.js');
var Scrollable$1 = require('./Scrollable.scss.js');
var ScrollTo = require('./components/ScrollTo/ScrollTo.js');
var stickyManager = require('../../utilities/sticky-manager/sticky-manager.js');
var context$1 = require('../../utilities/sticky-manager/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

const MAX_SCROLL_DISTANCE = 100;
const DELTA_THRESHOLD = 0.2;
const DELTA_PERCENTAGE = 0.2;
const EVENTS_TO_LOCK = ['scroll', 'touchmove', 'wheel'];
const PREFERS_REDUCED_MOTION = prefersReducedMotion();
const LOW_RES_BUFFER = 2;
class Scrollable extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      topShadow: false,
      bottomShadow: false,
      scrollPosition: 0,
      canScroll: false
    };
    this.stickyManager = new stickyManager.StickyManager();
    this.scrollArea = null;
    this.handleResize = debounce__default['default'](() => {
      this.handleScroll();
    }, 50, {
      trailing: true
    });

    this.setScrollArea = scrollArea => {
      this.scrollArea = scrollArea;
    };

    this.handleScroll = () => {
      const {
        scrollArea
      } = this;
      const {
        scrollPosition
      } = this.state;
      const {
        shadow,
        onScrolledToBottom
      } = this.props;

      if (scrollArea == null) {
        return;
      }

      const {
        scrollTop,
        clientHeight,
        scrollHeight
      } = scrollArea;
      const shouldBottomShadow = Boolean(shadow && !(scrollTop + clientHeight >= scrollHeight));
      const shouldTopShadow = Boolean(shadow && scrollTop > 0 && scrollPosition > 0);
      const canScroll = scrollHeight > clientHeight;
      const hasScrolledToBottom = scrollHeight - scrollTop <= clientHeight + LOW_RES_BUFFER;

      if (canScroll && hasScrolledToBottom && onScrolledToBottom) {
        onScrolledToBottom();
      }

      this.setState({
        topShadow: shouldTopShadow,
        bottomShadow: shouldBottomShadow,
        scrollPosition: scrollTop,
        canScroll
      });
    };

    this.scrollHint = () => {
      const {
        scrollArea
      } = this;

      if (scrollArea == null) {
        return;
      }

      const {
        clientHeight,
        scrollHeight
      } = scrollArea;

      if (PREFERS_REDUCED_MOTION || this.state.scrollPosition > 0 || scrollHeight <= clientHeight) {
        return;
      }

      const scrollDistance = scrollHeight - clientHeight;
      this.toggleLock();
      this.setState({
        scrollPosition: scrollDistance > MAX_SCROLL_DISTANCE ? MAX_SCROLL_DISTANCE : scrollDistance
      }, () => {
        window.requestAnimationFrame(this.scrollStep);
      });
    };

    this.scrollStep = () => {
      this.setState(({
        scrollPosition
      }) => {
        const delta = scrollPosition * DELTA_PERCENTAGE;
        return {
          scrollPosition: delta < DELTA_THRESHOLD ? 0 : scrollPosition - delta
        };
      }, () => {
        if (this.state.scrollPosition > 0) {
          window.requestAnimationFrame(this.scrollStep);
        } else {
          this.toggleLock(false);
        }
      });
    };

    this.scrollToPosition = scrollY => {
      this.setState({
        scrollPosition: scrollY
      });
    };
  }

  static forNode(node) {
    const closestElement = node.closest(shared.scrollable.selector);
    return closestElement instanceof HTMLElement ? closestElement : document;
  }

  componentDidMount() {
    if (this.scrollArea == null) {
      return;
    }

    this.stickyManager.setContainer(this.scrollArea);
    this.scrollArea.addEventListener('scroll', () => {
      window.requestAnimationFrame(this.handleScroll);
    });
    window.addEventListener('resize', this.handleResize);
    window.requestAnimationFrame(() => {
      this.handleScroll();

      if (this.props.hint) {
        this.scrollHint();
      }
    });
  }

  componentWillUnmount() {
    if (this.scrollArea == null) {
      return;
    }

    this.scrollArea.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.stickyManager.removeScrollListener();
  }

  componentDidUpdate() {
    const {
      scrollPosition
    } = this.state;

    if (scrollPosition && this.scrollArea && scrollPosition > 0) {
      this.scrollArea.scrollTop = scrollPosition;
    }
  }

  render() {
    const {
      topShadow,
      bottomShadow,
      canScroll
    } = this.state;
    const {
      children,
      className,
      horizontal,
      vertical = true,
      shadow,
      hint,
      focusable,
      onScrolledToBottom,
      ...rest
    } = this.props;
    const finalClassName = css.classNames(className, Scrollable$1['default'].Scrollable, vertical && Scrollable$1['default'].vertical, horizontal && Scrollable$1['default'].horizontal, topShadow && Scrollable$1['default'].hasTopShadow, bottomShadow && Scrollable$1['default'].hasBottomShadow, vertical && canScroll && Scrollable$1['default'].verticalHasScrolling);
    return /*#__PURE__*/React__default['default'].createElement(context.ScrollableContext.Provider, {
      value: this.scrollToPosition
    }, /*#__PURE__*/React__default['default'].createElement(context$1.StickyManagerContext.Provider, {
      value: this.stickyManager
    }, /*#__PURE__*/React__default['default'].createElement("div", Object.assign({
      className: finalClassName
    }, shared.scrollable.props, rest, {
      ref: this.setScrollArea // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      ,
      tabIndex: focusable ? 0 : undefined
    }), children)));
  }

  toggleLock(shouldLock = true) {
    const {
      scrollArea
    } = this;

    if (scrollArea == null) {
      return;
    }

    EVENTS_TO_LOCK.forEach(eventName => {
      if (shouldLock) {
        scrollArea.addEventListener(eventName, prevent);
      } else {
        scrollArea.removeEventListener(eventName, prevent);
      }
    });
  }

}
Scrollable.ScrollTo = ScrollTo.ScrollTo;

function prevent(evt) {
  evt.preventDefault();
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {
    return false;
  }
}

exports.Scrollable = Scrollable;