import { rateLimitedMethod } from '../../methods-app-test';

rateLimitedMethod.setHandler(() => true);
rateLimitedMethod.setRateLimit(
  {
    limit: 1,
    timeRange: 1000,
  },
  { testRateLimit: true },
);
