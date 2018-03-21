import { Method } from '../methods/methods';
import { IMPERSONATE_METHOD } from './impersonation';

export const impersonateUser = new Method({
  name: IMPERSONATE_METHOD,
  params: {
    authToken: String,
    userId: String,
  },
});
