'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var geometry = require('../../utilities/geometry.js');
var hooks = require('../../utilities/sticky-manager/hooks.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StickyInner extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isSticky: false,
      style: {}
    };
    this.placeHolderNode = null;
    this.stickyNode = null;

    this.setPlaceHolderNode = node => {
      this.placeHolderNode = node;
    };

    this.setStickyNode = node => {
      this.stickyNode = node;
    };

    this.handlePositioning = (stick, top = 0, left = 0, width = 0) => {
      const {
        isSticky
      } = this.state;

      if (stick && !isSticky || !stick && isSticky) {
        this.adjustPlaceHolderNode(stick);
        this.setState({
          isSticky: !isSticky
        });
      }

      const style = stick ? {
        position: 'fixed',
        top,
        left,
        width
      } : {};
      this.setState({
        style
      });
    };

    this.adjustPlaceHolderNode = add => {
      if (this.placeHolderNode && this.stickyNode) {
        this.placeHolderNode.style.paddingBottom = add ? `${geometry.getRectForNode(this.stickyNode).height}px` : '0px';
      }
    };
  }

  componentDidMount() {
    const {
      boundingElement,
      offset = false,
      disableWhenStacked = false,
      stickyManager
    } = this.props;
    if (!this.stickyNode || !this.placeHolderNode) return;
    stickyManager.registerStickyItem({
      stickyNode: this.stickyNode,
      placeHolderNode: this.placeHolderNode,
      handlePositioning: this.handlePositioning,
      offset,
      boundingElement,
      disableWhenStacked
    });
  }

  componentWillUnmount() {
    const {
      stickyManager
    } = this.props;
    if (!this.stickyNode) return;
    stickyManager.unregisterStickyItem(this.stickyNode);
  }

  render() {
    const {
      style,
      isSticky
    } = this.state;
    const {
      children
    } = this.props;
    const childrenContent = isFunction(children) ? children(isSticky) : children;
    return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.setPlaceHolderNode
    }), /*#__PURE__*/React__default['default'].createElement("div", {
      ref: this.setStickyNode,
      style: style
    }, childrenContent));
  }

} // This should have a typeguard instead of using Function
// eslint-disable-next-line @typescript-eslint/ban-types


function isFunction(arg) {
  return typeof arg === 'function';
}

function Sticky(props) {
  const stickyManager = hooks.useStickyManager();
  return /*#__PURE__*/React__default['default'].createElement(StickyInner, Object.assign({}, props, {
    stickyManager: stickyManager
  }));
}

exports.Sticky = Sticky;
