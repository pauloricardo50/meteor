// @flow
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

/**
 * getPercent - Given an array of values, any value that is undefined or null
 * will be counted as incomplete, make sure we don't divide by 0
 *
 * @param {array} array Array of numbers, strings, or dates
 *
 * @return {number} a value between 0 and 1
 */
export const getPercent = (array) => {
  if (!array) {
    return 0;
  }
  if (array.length === 0) {
    // If array is empty, return 100%
    return 1;
  }

  const percent = array.reduce((tot, val) => {
    if (isArray(val)) {
      // Empty arrays need to be filled
      return tot + (val.length ? 1 : 0);
    }
    if (val !== undefined && val !== null) {
      return tot + 1;
    }
    return tot;
  }, 0) / array.length;
  return Number.isFinite(percent) ? percent : 0;
};

// Given multiple objects of the form { percent, count },
// Merge them together with a single count and percent
export const getAggregatePercent = (percentageObjects) => {
  const {
    percent: aggregatePercent,
    count: aggregateCount,
  } = percentageObjects.reduce(
    (obj, { percent, count }) => ({
      percent: obj.percent + percent * count,
      count: obj.count + count,
    }),
    { percent: 0, count: 0 },
  );

  return {
    count: aggregateCount,
    percent: aggregateCount === 0 ? 0 : aggregatePercent / aggregateCount,
  };
};

const isNonEmptyObject = variable =>
  variable.constructor === Object && Object.keys(variable).length > 0;

const isArrayOfObjects = variable =>
  isArray(variable)
  && variable.length > 0
  && variable.every(item => item && item.constructor === Object);

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
export const flattenObjectTreeToArrays = (object, ancestorsPath = []) => {
  const result = [];

  forEach(object, (value, key) => {
    const keyPath = [...ancestorsPath, key.toString()];

    // check if the value of this key is a branch in the tree
    const isBranch = isNonEmptyObject(value) || isArrayOfObjects(value);

    if (isBranch) {
      result.push(...flattenObjectTreeToArrays(value, keyPath));
    } else {
      result.push({ path: keyPath, value });
    }
  });

  return result;
};

export const normalize = array =>
  array.reduce((obj, item) => ({ ...obj, [item.id || item._id]: item }), {});

export const simpleHash = (data) => {
  let string = data;
  if (typeof data !== 'string') {
    string = JSON.stringify(data);
  }

  let hash = 0;
  if (string.length === 0) {
    return hash;
  }
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};
