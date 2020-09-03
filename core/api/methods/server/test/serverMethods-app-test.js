import { Meteor } from 'meteor/meteor';

import {
  rateLimitedErrorMethod,
  rateLimitedMethod,
} from '../../methods-app-test';

rateLimitedMethod.setHandler(() => true);

rateLimitedMethod.setRateLimit(
  { limit: 1, timeRange: 1000 },
  { testRateLimit: true },
);

rateLimitedErrorMethod.setHandler(() => {
  throw new Meteor.Error('Error thrown');
});

rateLimitedErrorMethod.setRateLimit(
  { limit: 1, timeRange: 1000 },
  { testRateLimit: true },
);
