import { useRef } from 'react';
import { useIsAfterInitialMount } from './use-is-after-initial-mount.js';

/**
 * Similarly to the life-cycle method componentDidMount, useComponentDidMount
 * will be invoked after the component has mounted, and only the initial mount.
 * @param callback Defines a callback to invoke once the component has
 * initially mounted.
 * @example
 * function Playground({active}) {
 *  useComponentDidMount(() => {
 *    if (active) {
 *      console.warning(`Component has mounted.`);
 *    }
 *  });
 *
 *  return null;
 * }
 */

function useComponentDidMount(callback) {
  const isAfterInitialMount = useIsAfterInitialMount();
  const hasInvokedLifeCycle = useRef(false);

  if (isAfterInitialMount && !hasInvokedLifeCycle.current) {
    hasInvokedLifeCycle.current = true;
    return callback();
  }
}

export { useComponentDidMount };
