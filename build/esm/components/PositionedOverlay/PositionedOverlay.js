import React, { PureComponent } from 'react';
import { classNames } from '../../utilities/css.js';
import { getRectForNode, Rect } from '../../utilities/geometry.js';
import { dataPolarisTopBar, layer } from '../shared.js';
import { windowRect, calculateVerticalPosition, calculateHorizontalPosition, rectIsOutsideOfRect, intersectionWithViewport } from './utilities/math.js';
import styles from './PositionedOverlay.scss.js';
import { Scrollable } from '../Scrollable/Scrollable.js';
import { EventListener } from '../EventListener/EventListener.js';

const OBSERVER_CONFIG = {
  childList: true,
  subtree: true,
  characterData: true
};
class PositionedOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      measuring: true,
      activatorRect: getRectForNode(this.props.activator),
      right: undefined,
      left: undefined,
      top: 0,
      height: 0,
      width: null,
      positioning: 'below',
      zIndex: null,
      outsideScrollableContainer: false,
      lockPosition: false
    };
    this.overlay = null;
    this.scrollableContainer = null;
    this.observer = void 0;

    this.overlayDetails = () => {
      const {
        measuring,
        left,
        right,
        positioning,
        height,
        activatorRect
      } = this.state;
      return {
        measuring,
        left,
        right,
        desiredHeight: height,
        positioning,
        activatorRect
      };
    };

    this.setOverlay = node => {
      this.overlay = node;
    };

    this.handleMeasurement = () => {
      const {
        lockPosition,
        top
      } = this.state;
      this.observer.disconnect();
      this.setState(({
        left,
        top,
        right
      }) => ({
        left,
        right,
        top,
        height: 0,
        positioning: 'below',
        measuring: true
      }), () => {
        if (this.overlay == null || this.scrollableContainer == null) {
          return;
        }

        const {
          activator,
          preferredPosition = 'below',
          preferredAlignment = 'center',
          onScrollOut,
          fullWidth,
          fixed,
          preferInputActivator = true
        } = this.props;
        const preferredActivator = preferInputActivator ? activator.querySelector('input') || activator : activator;
        const activatorRect = getRectForNode(preferredActivator);
        const currentOverlayRect = getRectForNode(this.overlay);
        const scrollableElement = isDocument(this.scrollableContainer) ? document.body : this.scrollableContainer;
        const scrollableContainerRect = getRectForNode(scrollableElement);
        const overlayRect = fullWidth ? new Rect({ ...currentOverlayRect,
          width: activatorRect.width
        }) : currentOverlayRect; // If `body` is 100% height, it still acts as though it were not constrained to that size. This adjusts for that.

        if (scrollableElement === document.body) {
          scrollableContainerRect.height = document.body.scrollHeight;
        }

        let topBarOffset = 0;
        const topBarElement = scrollableElement.querySelector(`${dataPolarisTopBar.selector}`);

        if (topBarElement) {
          topBarOffset = topBarElement.clientHeight;
        }

        const overlayMargins = this.overlay.firstElementChild && this.overlay.firstChild instanceof HTMLElement ? getMarginsForNode(this.overlay.firstElementChild) : {
          activator: 0,
          container: 0,
          horizontal: 0
        };
        const containerRect = windowRect();
        const zIndexForLayer = getZIndexForLayerFromNode(activator);
        const zIndex = zIndexForLayer == null ? zIndexForLayer : zIndexForLayer + 1;
        const verticalPosition = calculateVerticalPosition(activatorRect, overlayRect, overlayMargins, scrollableContainerRect, containerRect, preferredPosition, fixed, topBarOffset);
        const horizontalPosition = calculateHorizontalPosition(activatorRect, overlayRect, containerRect, overlayMargins, preferredAlignment);
        this.setState({
          measuring: false,
          activatorRect: getRectForNode(activator),
          left: preferredAlignment !== 'right' ? horizontalPosition : undefined,
          right: preferredAlignment === 'right' ? horizontalPosition : undefined,
          top: lockPosition ? top : verticalPosition.top,
          lockPosition: Boolean(fixed),
          height: verticalPosition.height || 0,
          width: fullWidth ? overlayRect.width : null,
          positioning: verticalPosition.positioning,
          outsideScrollableContainer: onScrollOut != null && rectIsOutsideOfRect(activatorRect, intersectionWithViewport(scrollableContainerRect)),
          zIndex
        }, () => {
          if (!this.overlay) return;
          this.observer.observe(this.overlay, OBSERVER_CONFIG);
          this.observer.observe(activator, OBSERVER_CONFIG);
        });
      });
    };

    this.observer = new MutationObserver(this.handleMeasurement);
  }

  componentDidMount() {
    this.scrollableContainer = Scrollable.forNode(this.props.activator);

    if (this.scrollableContainer && !this.props.fixed) {
      this.scrollableContainer.addEventListener('scroll', this.handleMeasurement);
    }

    this.handleMeasurement();
  }

  componentWillUnmount() {
    this.observer.disconnect();

    if (this.scrollableContainer && !this.props.fixed) {
      this.scrollableContainer.removeEventListener('scroll', this.handleMeasurement);
    }
  }

  componentDidUpdate() {
    const {
      outsideScrollableContainer,
      top
    } = this.state;
    const {
      onScrollOut,
      active
    } = this.props;

    if (active && onScrollOut != null && top !== 0 && outsideScrollableContainer) {
      onScrollOut();
    }
  }

  render() {
    const {
      left,
      right,
      top,
      zIndex,
      width
    } = this.state;
    const {
      render,
      fixed,
      preventInteraction,
      classNames: propClassNames,
      zIndexOverride
    } = this.props;
    const style = {
      top: top == null || isNaN(top) ? undefined : top,
      left: left == null || isNaN(left) ? undefined : left,
      right: right == null || isNaN(right) ? undefined : right,
      width: width == null || isNaN(width) ? undefined : width,
      zIndex: zIndexOverride || zIndex || undefined
    };
    const className = classNames(styles.PositionedOverlay, fixed && styles.fixed, preventInteraction && styles.preventInteraction, propClassNames);
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: style,
      ref: this.setOverlay
    }, /*#__PURE__*/React.createElement(EventListener, {
      event: "resize",
      handler: this.handleMeasurement
    }), render(this.overlayDetails()));
  }

  forceUpdatePosition() {
    // Wait a single animation frame before re-measuring.
    // Consumer's may also need to setup their own timers for
    // triggering forceUpdatePosition() `children` use animation.
    // Ideally, forceUpdatePosition() is fired at the end of a transition event.
    requestAnimationFrame(this.handleMeasurement);
  }

}

function getMarginsForNode(node) {
  const nodeStyles = window.getComputedStyle(node);
  return {
    activator: parseFloat(nodeStyles.marginTop || '0'),
    container: parseFloat(nodeStyles.marginBottom || '0'),
    horizontal: parseFloat(nodeStyles.marginLeft || '0')
  };
}

function getZIndexForLayerFromNode(node) {
  const layerNode = node.closest(layer.selector) || document.body;
  const zIndex = layerNode === document.body ? 'auto' : parseInt(window.getComputedStyle(layerNode).zIndex || '0', 10);
  return zIndex === 'auto' || isNaN(zIndex) ? null : zIndex;
}

function isDocument(node) {
  return node === document;
}

export { PositionedOverlay };
