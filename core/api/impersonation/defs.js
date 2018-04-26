import { Method } from '../methods/methods';
import rateLimit from '../../utils/rate-limit';

export const impersonateUser = new Method({
  name: 'impersonateUser',
  params: {
    authToken: String,
    userId: String,
  },
});

// Limit this DDP method's call rate
rateLimit({ methods: [impersonateUser.config.name] });
