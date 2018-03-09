import { Method } from './methods';

Method.addAfterCall(({ context, config, params, result, error }) => {
  // Do something on the client
});
