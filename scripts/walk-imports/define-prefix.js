const path = require('path');

const prefix = process.argv[2];

console.log('finding messages with prefix', prefix);

// eslint-disable-next-line import/no-dynamic-require
const fr = require(path.resolve(__dirname, '../../core/lang/fr.json'));

const keys = Object.keys(fr);
const desiredPeriods = prefix.split('.').length;

const importDeclaration =
  "import defineMessage from 'core/components/Translation/defineMessage'";

const result = keys
  .filter(
    key => key.split('.').length === desiredPeriods && key.startsWith(prefix),
  )
  .map(
    key => `
defineMessage({
  id: '${key}',
  defaultMessage: '${fr[key]}'
});
  `,
  )
  .join('');

console.log('copy and paste:');
console.log('---------------');
console.log('');
console.log(importDeclaration);
console.log(result);
