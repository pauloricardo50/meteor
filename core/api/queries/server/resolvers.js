import { DOES_USER_EXIST } from '../resolverQueriesDefinitions';
import createResolver from './createResolver';

createResolver(
  DOES_USER_EXIST,
  () => {
    // Firewall
  },
  ({ email }) => {
    // Do something here
  },
);
