import { Method } from '../methods';

export const impersonateUser = new Method({
  name: 'impersonateUser',
  params: {
    authToken: String,
    userId: String,
  },
});
