import { useCallback } from 'react';
import { useDeepCompareRef } from './use-deep-compare-ref.js';

/**
 * A replacement for React's useCallback that'll allow for custom and deep compares.
 * @see {@link https://reactjs.org/docs/hooks-reference.html#usecallback}
 * @param callback Accepts a callback that's forwarded to React's useCallback
 * @param dependencies A dependency array similar to React's useCallback however it utilizes a deep compare
 * @param customCompare Opportunity to provide a custom compare function
 * @returns A memoized callback
 * @example
 * const Child = memo(function Child({onClick}) {
 *   console.log('Child has rendered.');
 *   return <button onClick={onClick}>Click me</button>;
 * });
 *
 * function ComponentExample() {
 *   const [timesClicked, setTimesClicked] = useState(0);
 *
 *   const handleClick = useDeepCallback(() => {
 *     setTimesClicked((timesClicked) => timesClicked + 1);
 *     // New reference every render
 *   }, [{}]);
 *
 *   return (
 *     <>
 *       <div>Times clicked: {timesClicked}</div>
 *       <Child onClick={handleClick} />
 *     </>
 *   );
 * }
 */

function useDeepCallback(callback, dependencies, customCompare) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, useDeepCompareRef(dependencies, customCompare));
}

export { useDeepCallback };
