import unset from 'lodash/unset';
import isObject from 'lodash/isObject';

const deepOmit = (value, keys) => {
  if (typeof value === 'undefined') {
    return {};
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = deepOmit(value[i], keys);
    }
    return value;
  }

  if (!isObject(value)) {
    return value;
  }

  if (typeof keys === 'string') {
    keys = [keys];
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (let j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      value[key] = deepOmit(value[key], keys);
    }
  }

  return value;
};

export default deepOmit;
