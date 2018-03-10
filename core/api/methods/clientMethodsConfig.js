import { Method } from './methods';

Method.addAfterCall(({ context, config, params, result, error }) => {
  console.log(`Hello from Method ${config.name} on the client`);
  // Do something on the client
});
