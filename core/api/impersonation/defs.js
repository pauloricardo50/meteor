import { Method } from '../methods/methods';
import { IMPERSONATE_METHOD } from './impersonation';
import rateLimit from '../../utils/rate-limit';

export const impersonateUser = new Method({
  name: IMPERSONATE_METHOD,
  params: {
    authToken: String,
    userId: String,
  },
});

rateLimit({ methods: [IMPERSONATE_METHOD] });
