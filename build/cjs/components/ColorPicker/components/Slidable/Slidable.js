'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var target = require('../../../../utilities/target.js');
var ColorPicker = require('../../ColorPicker.scss.js');
var EventListener = require('../../../EventListener/EventListener.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

let isDragging = false; // Required to solve a bug causing the underlying page/container to scroll
// while trying to drag the ColorPicker controls.
// This must be called as soon as possible to properly prevent the event.
// `passive: false` must also be set, as it seems webkit has changed the "default" behaviour
// https://bugs.webkit.org/show_bug.cgi?id=182521

if (!target.isServer) {
  window.addEventListener('touchmove', event => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
  }, {
    passive: false
  });
}

class Slidable extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      dragging: false
    };
    this.node = null;
    this.draggerNode = null;

    this.setDraggerNode = node => {
      this.draggerNode = node;
    };

    this.setNode = node => {
      this.node = node;
    };

    this.startDrag = event => {
      if (isMouseDownEvent(event)) {
        this.handleDraggerMove(event.clientX, event.clientY);
      }

      isDragging = true;
      this.setState({
        dragging: true
      });
    };

    this.handleDragEnd = () => {
      isDragging = false;
      this.setState({
        dragging: false
      });
    };

    this.handleMove = event => {
      event.stopImmediatePropagation();
      event.stopPropagation();

      if (event.cancelable) {
        event.preventDefault();
      }

      if (isMouseMoveEvent(event)) {
        this.handleDraggerMove(event.clientX, event.clientY);
        return;
      }

      this.handleDraggerMove(event.touches[0].clientX, event.touches[0].clientY);
    };

    this.handleDraggerMove = (x, y) => {
      if (this.node == null) {
        return;
      }

      const {
        onChange
      } = this.props;
      const rect = this.node.getBoundingClientRect();
      const offsetX = x - rect.left;
      const offsetY = y - rect.top;
      onChange({
        x: offsetX,
        y: offsetY
      });
    };
  }

  componentDidMount() {
    const {
      onDraggerHeight
    } = this.props;

    if (onDraggerHeight == null) {
      return;
    }

    const {
      draggerNode
    } = this;

    if (draggerNode == null) {
      return;
    }

    onDraggerHeight(draggerNode.clientWidth);

    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        onDraggerHeight(draggerNode.clientWidth);
      }, 0);
    }
  }

  render() {
    const {
      dragging
    } = this.state;
    const {
      draggerX = 0,
      draggerY = 0
    } = this.props;
    const draggerPositioning = {
      transform: `translate3d(${draggerX}px, ${draggerY}px, 0)`
    };
    const moveListener = dragging ? /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "mousemove",
      handler: this.handleMove,
      passive: false
    }) : null;
    const touchMoveListener = dragging ? /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "touchmove",
      handler: this.handleMove,
      passive: false
    }) : null;
    const endDragListener = dragging ? /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "mouseup",
      handler: this.handleDragEnd
    }) : null;
    const touchEndListener = dragging ? /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "touchend",
      handler: this.handleDragEnd
    }) : null;
    const touchCancelListener = dragging ? /*#__PURE__*/React__default['default'].createElement(EventListener.EventListener, {
      event: "touchcancel",
      handler: this.handleDragEnd
    }) : null;
    return /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.setNode,
      className: ColorPicker['default'].Slidable,
      onMouseDown: this.startDrag,
      onTouchStart: this.startDrag
    }, endDragListener, moveListener, touchMoveListener, touchEndListener, touchCancelListener, /*#__PURE__*/React__default['default'].createElement("div", {
      style: draggerPositioning,
      className: ColorPicker['default'].Dragger,
      ref: this.setDraggerNode
    }));
  }

}

function isMouseMoveEvent(event) {
  return event.type === 'mousemove';
}

function isMouseDownEvent(event) {
  return event.type === 'mousedown';
}

exports.Slidable = Slidable;
