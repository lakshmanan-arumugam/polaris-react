'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var debounce = require('lodash/debounce');
var ScrollContainer$1 = require('./ScrollContainer.scss.js');
var context = require('../../../../utilities/index-table/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);

function ScrollContainer({
  children,
  scrollableContainerRef,
  onScroll
}) {
  React.useEffect(() => {
    if (!scrollableContainerRef.current) return;
    scrollableContainerRef.current.dispatchEvent(new Event('scroll'));
  }, [scrollableContainerRef]);
  const [containerScroll, setContainerScroll] = React.useState(context.scrollDefaultContext); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleScroll = React.useCallback(debounce__default['default'](() => {
    if (!scrollableContainerRef.current) {
      return;
    }

    const availableScrollAmount = scrollableContainerRef.current.scrollWidth - scrollableContainerRef.current.offsetWidth;
    const canScrollLeft = scrollableContainerRef.current.scrollLeft > 0;
    const canScrollRight = scrollableContainerRef.current.scrollLeft < availableScrollAmount;
    onScroll(canScrollLeft, canScrollRight);
    setContainerScroll({
      scrollableContainer: scrollableContainerRef.current,
      canScrollLeft,
      canScrollRight
    });
  }, 40, {
    trailing: true,
    leading: true,
    maxWait: 40
  }), [onScroll, scrollableContainerRef]);
  return /*#__PURE__*/React__default['default'].createElement(context.ScrollContext.Provider, {
    value: containerScroll
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: ScrollContainer$1['default'].ScrollContainer,
    ref: scrollableContainerRef,
    onScroll: handleScroll
  }, children));
}

exports.ScrollContainer = ScrollContainer;
