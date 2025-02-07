import React, { PureComponent } from 'react';
import styles from '../../ColorPicker.scss.js';
import { hueForDraggerY, calculateDraggerY } from './utilities.js';
import { Slidable } from '../Slidable/Slidable.js';

class HuePicker extends PureComponent {
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
      const hue = hueForDraggerY(y, sliderHeight);
      onChange(hue);
    };
  }

  render() {
    const {
      hue
    } = this.props;
    const {
      sliderHeight,
      draggerHeight
    } = this.state;
    const draggerY = calculateDraggerY(hue, sliderHeight, draggerHeight);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.HuePicker,
      ref: this.setSliderHeight
    }, /*#__PURE__*/React.createElement(Slidable, {
      draggerY: draggerY,
      draggerX: 0,
      onChange: this.handleChange,
      onDraggerHeight: this.setDraggerHeight
    }));
  }

}

export { HuePicker };
