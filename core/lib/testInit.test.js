// Somehow the .app-test files importing this can't use import statements???
const uniforms = require('uniforms-material'); // Leave this imported here for autoforms to work

process.on('uncaughtException', (error) => {
  console.log('uncaughtException error', error);
});
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection error', error);
});
