import { Method } from '../methods/methods';

export const impersonateUser = new Method({
  name: 'impersonateUser',
  params: {
    authToken: String,
    userId: String,
  },
});
