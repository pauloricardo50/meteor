// Somehow the .app-test files importing this can't use import statements???
// Leave this imported here for autoforms to work
const SimpleSchema = require('simpl-schema').default;

const uniforms = require('uniforms-material');

SimpleSchema.extendOptions(['condition', 'customAllowedValues']);

process.on('uncaughtException', (error) => {
  console.log('uncaughtException error', error);
});
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection error', error);
});
