'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var css = require('../../utilities/css.js');
var Collapsible$1 = require('./Collapsible.scss.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function Collapsible({
  id,
  expandOnPrint,
  open,
  transition,
  children
}) {
  const [height, setHeight] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(open);
  const [animationState, setAnimationState] = React.useState('idle');
  const collapsibleContainer = React.useRef(null);
  const isFullyOpen = animationState === 'idle' && open && isOpen;
  const isFullyClosed = animationState === 'idle' && !open && !isOpen;
  const content = expandOnPrint || !isFullyClosed ? children : null;
  const wrapperClassName = css.classNames(Collapsible$1['default'].Collapsible, isFullyClosed && Collapsible$1['default'].isFullyClosed, expandOnPrint && Collapsible$1['default'].expandOnPrint);
  const collapsibleStyles = { ...(transition && {
      transitionDuration: `${transition.duration}`,
      transitionTimingFunction: `${transition.timingFunction}`
    }),
    ...{
      maxHeight: isFullyOpen ? 'none' : `${height}px`,
      overflow: isFullyOpen ? 'visible' : 'hidden'
    }
  };
  const handleCompleteAnimation = React.useCallback(({
    target
  }) => {
    if (target === collapsibleContainer.current) {
      setAnimationState('idle');
      setIsOpen(open);
    }
  }, [open]);
  React.useEffect(() => {
    if (open !== isOpen) {
      setAnimationState('measuring');
    }
  }, [open, isOpen]);
  React.useEffect(() => {
    if (!open || !collapsibleContainer.current) return; // If collapsible defaults to open, set an initial height

    setHeight(collapsibleContainer.current.scrollHeight); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (!collapsibleContainer.current) return;

    switch (animationState) {
      case 'idle':
        break;

      case 'measuring':
        setHeight(collapsibleContainer.current.scrollHeight);
        setAnimationState('animating');
        break;

      case 'animating':
        setHeight(open ? collapsibleContainer.current.scrollHeight : 0);
    }
  }, [animationState, open, isOpen]);
  return /*#__PURE__*/React__default['default'].createElement("div", {
    id: id,
    style: collapsibleStyles,
    ref: collapsibleContainer,
    className: wrapperClassName,
    onTransitionEnd: handleCompleteAnimation,
    "aria-expanded": open
  }, content);
}

exports.Collapsible = Collapsible;
