'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var context = require('../../utilities/focus-manager/context.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function FocusManager({
  children
}) {
  const [trapFocusList, setTrapFocusList] = React.useState([]);
  const add = React.useCallback(id => {
    setTrapFocusList(list => [...list, id]);
  }, []);
  const remove = React.useCallback(id => {
    let removed = true;
    setTrapFocusList(list => {
      const clone = [...list];
      const index = clone.indexOf(id);

      if (index === -1) {
        removed = false;
      } else {
        clone.splice(index, 1);
      }

      return clone;
    });
    return removed;
  }, []);
  const value = React.useMemo(() => ({
    trapFocusList,
    add,
    remove
  }), [add, trapFocusList, remove]);
  return /*#__PURE__*/React__default['default'].createElement(context.FocusManagerContext.Provider, {
    value: value
  }, children);
}

exports.FocusManager = FocusManager;
