import React from 'react';

import T from '../components/Translation';
import { toNumber } from './conversionFunctions';

const onlyNums = value => value.replace(/[^\d]/g, '');
const onlyNumsAndPlus = value => value.replace(/[^\d&+]/g, '');

export const numberFormatters = {
  parse: value => value && toNumber(value),
  // format: value => value,
};

export const phoneFormatters = {
  parse: value => value && onlyNumsAndPlus(value),
  format: value => (value ? onlyNumsAndPlus(value) : ''),
};

export const percentFormatters = {
  parse: value =>
    value === '' ? '' : Math.round(parseFloat(value) * 100) / 10000,
  format: value => (value === '' ? '' : (value * 100).toFixed(2)),
};

export const moneyFormatters = {
  parse: value => toNumber(value),
};

const setRequired = initialValue =>
  initialValue === undefined ? true : initialValue;

export const makeFormArray = (array, intlPrefix) =>
  array.map(field => ({
    ...field,
    required: setRequired(field.required),
    label: field.label || <T id={`${intlPrefix}.${field.id}`} />,
  }));
