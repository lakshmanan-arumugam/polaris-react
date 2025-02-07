'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ColorPicker = require('../../ColorPicker.scss.js');
var utilities = require('./utilities.js');
var Slidable = require('../Slidable/Slidable.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class HuePicker extends React.PureComponent {
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
      const hue = utilities.hueForDraggerY(y, sliderHeight);
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
    const draggerY = utilities.calculateDraggerY(hue, sliderHeight, draggerHeight);
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: ColorPicker['default'].HuePicker,
      ref: this.setSliderHeight
    }, /*#__PURE__*/React__default['default'].createElement(Slidable.Slidable, {
      draggerY: draggerY,
      draggerX: 0,
      onChange: this.handleChange,
      onDraggerHeight: this.setDraggerHeight
    }));
  }

}

exports.HuePicker = HuePicker;
