import { Method } from '../methods/methods';
import rateLimit from '../../utils/rate-limit';

const method = {
  name: 'impersonateUser',
  params: {
    authToken: String,
    userId: String,
  },
};

export const impersonateUser = new Method(method);

// Limit this DDP method's call rate
rateLimit({ methods: [method] });
