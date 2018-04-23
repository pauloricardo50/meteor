import React from 'react';
import { T } from '../Translation';
import { toNumber } from '../../utils/conversionFunctions';

const onlyNums = value => value.replace(/[^\d]/g, '');

export const numberFormatters = {
  parse: value => value && onlyNums(value),
  format: value => value && `${value}`,
};

export const percentFormatters = {
  parse: value => Math.round(parseFloat(value) * 100) / 10000,
  format: value => (value * 100).toFixed(2),
};

export const moneyFormatters = {
  parse: value => toNumber(value),
};

const setRequired = initialValue =>
  (initialValue === undefined ? true : initialValue);

export const makeFormArray = (array, intlPrefix) =>
  array.map(field => ({
    ...field,
    required: setRequired(field.required),
    label: field.label || <T id={`${intlPrefix}.${field.id}`} />,
  }));
