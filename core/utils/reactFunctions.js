import React from 'react';
import { renderComponent } from 'recompose';
import get from 'lodash/get';

export const childrenToComponent = children => props =>
  React.Children.map(children, child => React.cloneElement(child, props));

export const renderObjectOrFunction = objectOrFunction =>
  renderComponent(typeof objectOrFunction === 'function'
    ? objectOrFunction
    : () => objectOrFunction);

const isEqual = (a, b) => {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, i) => isEqual(item, b[i]));
  }

  if (
    (typeof a === 'object' && a !== null)
    || (typeof b === 'object' && b !== null)
  ) {
    throw new Error('Should not compare objects between each other, use a more nested key');
  }

  // Ignore edge cases, normally our props should never be NaN or Infinity
  return a === b;
};

export const arePathsEqual = paths => (object1, object2) =>
  paths.every(path => isEqual(get(object1, path), get(object2, path)));

export const arePathsUnequal = (paths) => {
  const testFunc = arePathsEqual(paths);
  return (...args) => !testFunc(...args);
};
