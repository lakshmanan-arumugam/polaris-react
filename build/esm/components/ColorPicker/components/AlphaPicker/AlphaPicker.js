import React, { PureComponent } from 'react';
import { hsbToRgb } from '../../../../utilities/color-transformers.js';
import styles from '../../ColorPicker.scss.js';
import { alphaForDraggerY, calculateDraggerY } from './utilities.js';
import { Slidable } from '../Slidable/Slidable.js';

class AlphaPicker extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      sliderHeight: 0,
      draggerHeight: 0
    };

    this.setSliderHeight = node => {
      if (node == null) {
        return;
      }

      this.setState({
        sliderHeight: node.clientHeight
      });

      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          this.setState({
            sliderHeight: node.clientHeight
          });
        }, 0);
      }
    };

    this.setDraggerHeight = height => {
      this.setState({
        draggerHeight: height
      });
    };

    this.handleChange = ({
      y
    }) => {
      const {
        onChange
      } = this.props;
      const {
        sliderHeight
      } = this.state;
      const alpha = alphaForDraggerY(y, sliderHeight);
      onChange(alpha);
    };
  }

  render() {
    const {
      color,
      alpha
    } = this.props;
    const {
      sliderHeight,
      draggerHeight
    } = this.state;
    const draggerY = calculateDraggerY(alpha, sliderHeight, draggerHeight);
    const background = alphaGradientForColor(color);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.AlphaPicker,
      ref: this.setSliderHeight
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.ColorLayer,
      style: {
        background
      }
    }), /*#__PURE__*/React.createElement(Slidable, {
      draggerY: draggerY,
      draggerX: 0,
      onChange: this.handleChange,
      onDraggerHeight: this.setDraggerHeight
    }));
  }

}

function alphaGradientForColor(color) {
  const {
    red,
    green,
    blue
  } = hsbToRgb(color);
  const rgb = `${red}, ${green}, ${blue}`;
  return `linear-gradient(to top, rgba(${rgb}, 0) 18px, rgba(${rgb}, 1) calc(100% - 18px))`;
}

export { AlphaPicker };
