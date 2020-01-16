// Somehow the .app-test files importing this can't use import statements???
// Leave this imported here for autoforms to work
require('uniforms-bridge-simple-schema-2');
const SimpleSchema = require('simpl-schema').default;

const uniforms = require('uniforms-material');

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
