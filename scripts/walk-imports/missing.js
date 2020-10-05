/* eslint-disable import/no-dynamic-require */
const { resolve } = require('path');

const lang = require(resolve(__dirname, '../../core/lang/fr.json'));
const combined = require(resolve(__dirname, '../../lang/combined.json'));

const messages = Object.values(combined).map(value => value.defaultMessage);
const original = Object.keys(lang);

let count = 0;

original.forEach(key => {
  const hasId = key in combined;
  const hasMessage = messages.includes(lang[key]);

  if (!hasId && !hasMessage) {
    count += 1;
  }
});

console.log('Original :', original.length);
console.log('Extracted:', Object.keys(combined).length);
console.log(`Missing  : ${count}`);
console.log(
  'Added    :',
  -1 * (original.length - count - Object.keys(combined).length),
);
