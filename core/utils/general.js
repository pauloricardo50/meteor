import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

export const arrayify = (value) => {
  if (value) {
    if (isArray(value)) {
      return value;
    }
    return [value];
  }

  return [];
};

// TODO: TEST for: simple, nested objects, nested objects with array & undefined data values.
// Converts an object to an array of objects containing
// the path to the leaf & leaf's value:
// The returned array be the exact structure that lodash's
// `get` function receives: https://lodash.com/docs/4.17.10#get
// Example:
// { key1: {key2: {key3: [{key31: 1}]}}, key4: 2 }
//  =>
// [
//   { path: ['key1', 'key2', 'key3', '0', 'key31'], value: 1 },
//   { path: ['key4']: value: 2}
// ]
export const flattenObjectTree = (object, ancestorsPath = []) => {
  const result = [];

  forEach(object, (value, key) => {
    const keyPath = [...ancestorsPath, key.toString()];

    // check if the value of this key is a branch of the object's tree
    const isBranch =
      value.constructor === Object ||
      (value.constructor === Array &&
        (value.length > 0 && value[0] && value[0].constructor === Object));

    if (isBranch) {
      result.push(...flattenObjectTree(value, keyPath));
    } else {
      result.push({ path: keyPath, value });
    }
  });

  return result;
};
