// Somehow the .app-test files importing this can't use import statements???
// Leave this imported here for autoforms to work
require('uniforms-bridge-simple-schema-2');
const SimpleSchema = require('simpl-schema').default;
const IntlMessageFormat = require('intl-messageformat').default;
const uniforms = require('uniforms-material');
const intl = require('../utils/intl').default;
const messagesFR = require('../lang/fr.json');

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);

process.on('uncaughtException', error => {
  console.log('uncaughtException error', error);
});
process.on('unhandledRejection', error => {
  console.log('unhandledRejection error', error);
});

// Do this so that code accessing the backend still works during tests
Meteor.settings.public.subdomains.backend = 'http://localhost:5505';

const oldFormatMessage = intl.formatMessage;
intl.formatMessage = (...args) => {
  const [firstArg, ...rest] = args;

  return oldFormatMessage({ ...firstArg, messages: messagesFR }, ...rest);
};
