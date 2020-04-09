import isObject from 'lodash/isObject';
import unset from 'lodash/unset';

// Omit keys from an object recursively
const deepOmit = (object, keys) => {
  if (typeof object === 'undefined') {
    return {};
  }

  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i++) {
      object[i] = deepOmit(object[i], keys);
    }
    return object;
  }

  if (!isObject(object)) {
    return object;
  }

  if (typeof keys === 'string') {
    keys = [keys];
  }

  if (!Array.isArray(keys)) {
    return object;
  }

  for (let j = 0; j < keys.length; j++) {
    unset(object, keys[j]);
  }

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      object[key] = deepOmit(object[key], keys);
    }
  }

  return object;
};

export default deepOmit;
