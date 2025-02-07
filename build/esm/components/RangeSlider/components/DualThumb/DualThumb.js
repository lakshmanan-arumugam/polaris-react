import React, { Component, createRef } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { classNames } from '../../../../utilities/css.js';
import { CSS_VAR_PREFIX } from '../../utilities/index.js';
import { Key } from '../../../../types.js';
import styles from './DualThumb.scss.js';
import { Labelled } from '../../../Labelled/Labelled.js';
import { labelID } from '../../../Label/Label.js';
import { EventListener } from '../../../EventListener/EventListener.js';
import { FeaturesContext } from '../../../../utilities/features/context.js';

var Control;

(function (Control) {
  Control[Control["Lower"] = 0] = "Lower";
  Control[Control["Upper"] = 1] = "Upper";
})(Control || (Control = {}));

class DualThumb extends Component {
  constructor(...args) {
    super(...args);
    this.context = void 0;
    this.state = {
      value: sanitizeValue(this.props.value, this.props.min, this.props.max, this.props.step),
      trackWidth: 0,
      trackLeft: 0
    };
    this.track = /*#__PURE__*/createRef();
    this.trackWrapper = /*#__PURE__*/createRef();
    this.thumbLower = /*#__PURE__*/createRef();
    this.thumbUpper = /*#__PURE__*/createRef();
    this.setTrackPosition = debounce(() => {
      if (this.track.current) {
        const thumbSize = 16;
        const {
          width,
          left
        } = this.track.current.getBoundingClientRect();
        const adjustedTrackWidth = width - thumbSize;
        const adjustedTrackLeft = left + thumbSize / 2;
        const range = this.props.max - this.props.min;
        const minValuePosition = this.props.min / range * adjustedTrackWidth;
        this.setState({
          trackWidth: adjustedTrackWidth,
          trackLeft: adjustedTrackLeft - minValuePosition
        });
      }
    }, 40, {
      leading: true,
      trailing: true,
      maxWait: 40
    });

    this.handleMouseDownThumbLower = event => {
      if (event.button !== 0 || this.props.disabled) return;
      registerMouseMoveHandler(this.handleMouseMoveThumbLower);
      event.stopPropagation();
    };

    this.handleMouseMoveThumbLower = event => {
      const valueUpper = this.state.value[1];
      this.setValue([this.actualXPosition(event.clientX), valueUpper], Control.Upper);
    };

    this.handleTouchStartThumbLower = event => {
      if (this.props.disabled) return;
      registerTouchMoveHandler(this.handleTouchMoveThumbLower);
      event.stopPropagation();
    };

    this.handleTouchMoveThumbLower = event => {
      event.preventDefault();
      const valueUpper = this.state.value[1];
      this.setValue([this.actualXPosition(event.touches[0].clientX), valueUpper], Control.Upper);
    };

    this.handleMouseDownThumbUpper = event => {
      if (event.button !== 0 || this.props.disabled) return;
      registerMouseMoveHandler(this.handleMouseMoveThumbUpper);
      event.stopPropagation();
    };

    this.handleMouseMoveThumbUpper = event => {
      const valueLower = this.state.value[0];
      this.setValue([valueLower, this.actualXPosition(event.clientX)], Control.Lower);
    };

    this.handleTouchStartThumbUpper = event => {
      if (this.props.disabled) return;
      registerTouchMoveHandler(this.handleTouchMoveThumbUpper);
      event.stopPropagation();
    };

    this.handleTouchMoveThumbUpper = event => {
      event.preventDefault();
      const valueLower = this.state.value[0];
      this.setValue([valueLower, this.actualXPosition(event.touches[0].clientX)], Control.Lower);
    };

    this.handleKeypressLower = event => {
      if (this.props.disabled) return;
      const {
        incrementValueLower,
        decrementValueLower
      } = this;
      const handlerMap = {
        [Key.UpArrow]: incrementValueLower,
        [Key.RightArrow]: incrementValueLower,
        [Key.DownArrow]: decrementValueLower,
        [Key.LeftArrow]: decrementValueLower
      };
      const handler = handlerMap[event.keyCode];

      if (handler != null) {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }
    };

    this.handleKeypressUpper = event => {
      if (this.props.disabled) return;
      const {
        incrementValueUpper,
        decrementValueUpper
      } = this;
      const handlerMap = {
        [Key.UpArrow]: incrementValueUpper,
        [Key.RightArrow]: incrementValueUpper,
        [Key.DownArrow]: decrementValueUpper,
        [Key.LeftArrow]: decrementValueUpper
      };
      const handler = handlerMap[event.keyCode];

      if (handler != null) {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }
    };

    this.incrementValueLower = () => {
      this.setValue([this.state.value[0] + this.props.step, this.state.value[1]], Control.Upper);
    };

    this.decrementValueLower = () => {
      this.setValue([this.state.value[0] - this.props.step, this.state.value[1]], Control.Upper);
    };

    this.incrementValueUpper = () => {
      this.setValue([this.state.value[0], this.state.value[1] + this.props.step], Control.Lower);
    };

    this.decrementValueUpper = () => {
      this.setValue([this.state.value[0], this.state.value[1] - this.props.step], Control.Lower);
    };

    this.dispatchValue = () => {
      const {
        onChange,
        id
      } = this.props;
      const {
        value
      } = this.state;
      onChange(value, id);
    };

    this.setValue = (dirtyValue, control) => {
      const {
        props: {
          min,
          max,
          step
        },
        state: {
          value
        }
      } = this;
      const sanitizedValue = sanitizeValue(dirtyValue, min, max, step, control);

      if (isEqual(sanitizedValue, value) === false) {
        this.setState({
          value: sanitizedValue
        }, this.dispatchValue);
      }
    };

    this.handleMouseDownTrack = event => {
      if (event.button !== 0 || this.props.disabled) return;
      event.preventDefault();
      const clickXPosition = this.actualXPosition(event.clientX);
      const {
        value
      } = this.state;
      const distanceFromLowerThumb = Math.abs(value[0] - clickXPosition);
      const distanceFromUpperThumb = Math.abs(value[1] - clickXPosition);

      if (distanceFromLowerThumb <= distanceFromUpperThumb) {
        this.setValue([clickXPosition, value[1]], Control.Upper);
        registerMouseMoveHandler(this.handleMouseMoveThumbLower);

        if (this.thumbLower.current != null) {
          this.thumbLower.current.focus();
        }
      } else {
        this.setValue([value[0], clickXPosition], Control.Lower);
        registerMouseMoveHandler(this.handleMouseMoveThumbUpper);

        if (this.thumbUpper.current != null) {
          this.thumbUpper.current.focus();
        }
      }
    };

    this.handleTouchStartTrack = event => {
      if (this.props.disabled) return;
      event.preventDefault();
      const clickXPosition = this.actualXPosition(event.touches[0].clientX);
      const {
        value
      } = this.state;
      const distanceFromLowerThumb = Math.abs(value[0] - clickXPosition);
      const distanceFromUpperThumb = Math.abs(value[1] - clickXPosition);

      if (distanceFromLowerThumb <= distanceFromUpperThumb) {
        this.setValue([clickXPosition, value[1]], Control.Upper);
        registerTouchMoveHandler(this.handleTouchMoveThumbLower);

        if (this.thumbLower.current != null) {
          this.thumbLower.current.focus();
        }
      } else {
        this.setValue([value[0], clickXPosition], Control.Lower);
        registerTouchMoveHandler(this.handleTouchMoveThumbUpper);

        if (this.thumbUpper.current != null) {
          this.thumbUpper.current.focus();
        }
      }
    };

    this.actualXPosition = dirtyXPosition => {
      if (this.track.current) {
        const {
          min,
          max
        } = this.props;
        const {
          trackLeft,
          trackWidth
        } = this.state;
        const relativeX = dirtyXPosition - trackLeft;
        const percentageOfTrack = relativeX / trackWidth;
        return percentageOfTrack * (max - min);
      } else {
        return 0;
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      min,
      step,
      max,
      value,
      onChange,
      id
    } = props;
    const {
      prevValue
    } = state;

    if (isEqual(prevValue, value)) {
      return null;
    }

    const sanitizedValue = sanitizeValue(value, min, max, step);

    if (!isEqual(value, sanitizedValue)) {
      onChange(sanitizedValue, id);
    }

    return {
      prevValue: value,
      value: sanitizedValue
    };
  }

  componentDidMount() {
    this.setTrackPosition();

    if (this.trackWrapper.current != null) {
      this.trackWrapper.current.addEventListener('touchstart', this.handleTouchStartTrack, {
        passive: false
      });
    }
  }

  componentWillUnmount() {
    if (this.trackWrapper.current != null) {
      this.trackWrapper.current.removeEventListener('touchstart', this.handleTouchStartTrack);
    }
  }

  render() {
    const {
      id,
      min,
      max,
      prefix,
      suffix,
      disabled,
      output,
      error,
      onFocus,
      onBlur,
      label,
      labelAction,
      labelHidden,
      helpText
    } = this.props;
    const {
      value
    } = this.state;
    const idLower = id;
    const idUpper = `${id}Upper`;
    const describedBy = [];

    if (error) {
      describedBy.push(`${id}Error`);
    }

    const ariaDescribedBy = describedBy.length ? describedBy.join(' ') : undefined;
    const trackWrapperClassName = classNames(styles.TrackWrapper, error && styles.error, disabled && styles.disabled);
    const thumbLowerClassName = classNames(styles.Thumbs, styles.ThumbLower, disabled && styles.disabled);
    const thumbUpperClassName = classNames(styles.Thumbs, styles.ThumbUpper, disabled && styles.disabled);
    const trackWidth = this.state.trackWidth;
    const range = max - min;
    const minValuePosition = min / range * trackWidth;
    const leftPositionThumbLower = value[0] / range * trackWidth - minValuePosition;
    const leftPositionThumbUpper = value[1] / range * trackWidth - minValuePosition;
    const outputLowerClassName = classNames(styles.Output, styles.OutputLower);
    const outputMarkupLower = !disabled && output ? /*#__PURE__*/React.createElement("output", {
      htmlFor: idLower,
      className: outputLowerClassName,
      style: {
        left: `${leftPositionThumbLower}px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.OutputBubble
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.OutputText
    }, value[0]))) : null;
    const outputUpperClassName = classNames(styles.Output, styles.OutputUpper);
    const outputMarkupUpper = !disabled && output ? /*#__PURE__*/React.createElement("output", {
      htmlFor: idUpper,
      className: outputUpperClassName,
      style: {
        left: `${leftPositionThumbUpper}px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.OutputBubble
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.OutputText
    }, value[1]))) : null;
    const cssVars = {
      [`${CSS_VAR_PREFIX}progress-lower`]: `${leftPositionThumbLower}px`,
      [`${CSS_VAR_PREFIX}progress-upper`]: `${leftPositionThumbUpper}px`
    };
    const prefixMarkup = prefix && /*#__PURE__*/React.createElement("div", {
      className: styles.Prefix
    }, prefix);
    const suffixMarkup = suffix && /*#__PURE__*/React.createElement("div", {
      className: styles.Suffix
    }, suffix);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Labelled, {
      id: id,
      label: label,
      error: error,
      action: labelAction,
      labelHidden: labelHidden,
      helpText: helpText
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.Wrapper
    }, prefixMarkup, /*#__PURE__*/React.createElement("div", {
      className: trackWrapperClassName,
      onMouseDown: this.handleMouseDownTrack,
      ref: this.trackWrapper
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.Track,
      style: cssVars,
      ref: this.track
    }), /*#__PURE__*/React.createElement("div", {
      className: styles['Track--dashed']
    }), /*#__PURE__*/React.createElement("div", {
      id: idLower,
      className: thumbLowerClassName,
      style: {
        left: `${leftPositionThumbLower}px`
      },
      role: "slider",
      "aria-disabled": disabled,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": value[0],
      "aria-invalid": Boolean(error),
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": labelID(id),
      onFocus: onFocus,
      onBlur: onBlur,
      tabIndex: 0,
      onKeyDown: this.handleKeypressLower,
      onMouseDown: this.handleMouseDownThumbLower,
      onTouchStart: this.handleTouchStartThumbLower,
      ref: this.thumbLower
    }), outputMarkupLower, /*#__PURE__*/React.createElement("div", {
      id: idUpper,
      className: thumbUpperClassName,
      style: {
        left: `${leftPositionThumbUpper}px`
      },
      role: "slider",
      "aria-disabled": disabled,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": value[1],
      "aria-invalid": Boolean(error),
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": labelID(id),
      onFocus: onFocus,
      onBlur: onBlur,
      tabIndex: 0,
      onKeyDown: this.handleKeypressUpper,
      onMouseDown: this.handleMouseDownThumbUpper,
      onTouchStart: this.handleTouchStartThumbUpper,
      ref: this.thumbUpper
    }), outputMarkupUpper), suffixMarkup)), /*#__PURE__*/React.createElement(EventListener, {
      event: "resize",
      handler: this.setTrackPosition
    }));
  }

}
DualThumb.contextType = FeaturesContext;

function registerMouseMoveHandler(handler) {
  document.addEventListener('mousemove', handler);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', handler);
  }, {
    once: true
  });
}

function registerTouchMoveHandler(handler) {
  const removeHandler = () => {
    document.removeEventListener('touchmove', handler);
    document.removeEventListener('touchend', removeHandler);
    document.removeEventListener('touchcancel', removeHandler);
  };

  document.addEventListener('touchmove', handler, {
    passive: false
  });
  document.addEventListener('touchend', removeHandler, {
    once: true
  });
  document.addEventListener('touchcancel', removeHandler, {
    once: true
  });
}

function sanitizeValue(value, min, max, step, control = Control.Upper) {
  let upperValue = inBoundsUpper(roundedToStep(value[1]));
  let lowerValue = inBoundsLower(roundedToStep(value[0]));
  const maxLowerValue = upperValue - step;
  const minUpperValue = lowerValue + step;

  if (control === Control.Upper && lowerValue > maxLowerValue) {
    lowerValue = maxLowerValue;
  } else if (control === Control.Lower && upperValue < minUpperValue) {
    upperValue = minUpperValue;
  }

  return [lowerValue, upperValue];

  function inBoundsUpper(value) {
    const lowerMin = min + step;

    if (value < lowerMin) {
      return lowerMin;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }

  function inBoundsLower(value) {
    const upperMax = max - step;

    if (value < min) {
      return min;
    } else if (value > upperMax) {
      return upperMax;
    } else {
      return value;
    }
  }

  function roundedToStep(value) {
    return Math.round(value / step) * step;
  }
}

export { DualThumb };
