'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var clamp = require('../../../../utilities/clamp.js');

const VERTICAL_PADDING = 13;
function calculateDraggerY(hue, sliderHeight, draggerHeight) {
  const offset = offsetForHue(hue, sliderHeight, draggerHeight);
  return clamp.clamp(offset, 0, sliderHeight);
}
function hueForDraggerY(y, sliderHeight) {
  const offsetY = clamp.clamp(y, 0, sliderHeight);
  return hueForOffset(offsetY, sliderHeight);
}

function hueForOffset(offset, sliderHeight) {
  const selectionHeight = offset - VERTICAL_PADDING;
  const slidableArea = sliderHeight - VERTICAL_PADDING * 2;
  return clamp.clamp(selectionHeight / slidableArea * 360, 0, 360);
}

function offsetForHue(hue, sliderHeight, draggerHeight) {
  const slidableArea = sliderHeight - (draggerHeight + VERTICAL_PADDING);
  return clamp.clamp(hue / 360 * slidableArea + VERTICAL_PADDING, 0, sliderHeight - draggerHeight);
}

exports.calculateDraggerY = calculateDraggerY;
exports.hueForDraggerY = hueForDraggerY;
