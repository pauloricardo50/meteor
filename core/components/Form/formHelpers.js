import { toNumber } from '../../utils/conversionFunctions';

// Validators
export const required = value => (value ? undefined : 'Required');

export const makeMaxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

export const number = value =>
  (value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined);

export const makeMinValue = min => value =>
  ((value || value === 0) && value < min ? `Must be at least ${min}` : undefined);

// For empty strings if will return undefined, careful to use required as well
export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);

export const percentFormatters = {
  parse: value => Math.round(parseFloat(value) * 100) / 10000,
  format: value => (value * 100).toFixed(2),
};

export const moneyFormatters = {
  parse: value => toNumber(value),
};
