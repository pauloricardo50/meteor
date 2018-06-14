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

// Converts an object to an array of path to leaf & leaf:
// Must be the exact structure array strucure that lodash's `get` function
// uses: https://lodash.com/docs/4.17.10#get
// Example: { key1: {key2: {key3: [{key31: 1}]}}, key4: 2 } => [{ path: ['key1', 'key2', 'key3', '0', 'key31'], value: 1 }, { path: ['key4']: value: 2}]

// TODO: test for: simple, nested objects, nested objects with array & undefined data values.
export const flattenObject = (object, ancestorsPath = []) => {
  let result = [];

  forEach(object, (value, key) => {
    const keyPath = [...ancestorsPath, key.toString()];

    // check if the value of this key is a branch or a leaf
    // of the object tree
    const isBranch =
      value.constructor === Object ||
      value.constructor === Array && (
        value.length > 0 && value[0] && value[0].constructor === Object
      );

    if (isBranch) {
      result.push(...flattenObject(value, keyPath));
    }
    else {
      result.push({ path: keyPath, value });
    }
  });

  return result;
}