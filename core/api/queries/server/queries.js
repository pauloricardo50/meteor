import { DOES_USER_EXIST } from '../queryDefinitions';
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
