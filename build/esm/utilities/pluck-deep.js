import { isObject } from './is-object.js';

function pluckDeep(obj, key) {
  if (!obj) {
    return null;
  }

  const keys = Object.keys(obj);

  for (const currKey of keys) {
    if (currKey === key) {
      return obj[key];
    }

    if (isObject(obj[currKey])) {
      const plucked = pluckDeep(obj[currKey], key);

      if (plucked) {
        return plucked;
      }
    }
  }

  return null;
}

export { pluckDeep };
