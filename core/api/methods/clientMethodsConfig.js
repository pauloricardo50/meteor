import * as methods from './methods';

console.log('methods:', methods);

Methods.addAfterCall(({ context, config, params, result, error }) => {
  // Do something on the client
});
