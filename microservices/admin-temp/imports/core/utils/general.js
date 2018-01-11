import isArray from 'lodash/isArray';

export const arrayify = value =>
  (value ? (isArray(value) ? value : [value]) : []);
