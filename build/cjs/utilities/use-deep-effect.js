'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useDeepCompareRef = require('./use-deep-compare-ref.js');

/**
 * A replacement for React's useEffect that'll allow for custom and deep
 * compares of the dependency list.
 * @see {@link https://reactjs.org/docs/hooks-reference.html#useeffect}
 * @param callback Accepts a callback that's forwarded to React's useEffect
 * @param dependencies A dependency array similar to React's useEffect however it utilizes a deep compare
 * @param customCompare Opportunity to provide a custom compare function
 * @example
 * function ComponentExample() {
 *  const [, forceUpdate] = useState();
 *  const obj = {a: 1};
 *
 *  useDeepEffect(() => {
 *    console.log('useDeepEffect invocation');
 *    forceUpdate(obj);
 *  }, [obj]);
 *
 *  return null;
 * }
 */
function useDeepEffect(callback, dependencies, customCompare) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(callback, useDeepCompareRef.useDeepCompareRef(dependencies, customCompare));
}

exports.useDeepEffect = useDeepEffect;
