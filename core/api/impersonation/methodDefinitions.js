import { Method } from '../methods/methods';

export const impersonateUser = new Method({
  name: 'impersonateUser',
  params: {
    authToken: String,
    userId: String,
  },
});

export const impersonateAdmin = new Method({
  name: 'impersonateAdmin',
  params: {
    userId: String,
  },
});
