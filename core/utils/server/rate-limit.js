import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? 'seconde' : 'secondes';
  return `Doucement, tu peux reessayer dans ${time} ${seconds}.`;
});

// 1 call every 30s
const defaultLimit = 1;
const defaultTimeRange = 30000;

// 10 calls every 30s
const defaultDevLimit = 10;
const defaultDevTimerange = 30000;

const shouldRateLimit = testRateLimit => !Meteor.isAppTest || testRateLimit;
const getRateLimit = ({
  limit = defaultLimit,
  timeRange = defaultTimeRange,
}) => {
  const isDev = Meteor.isDevelopment;
  const isTest = Meteor.isAppTest;

  if (isTest) {
    return { limit, timeRange };
  }

  if (isDev) {
    return { limit: defaultDevLimit, timeRange: defaultDevTimerange };
  }

  return { limit, timeRange };
};

export const setMethodLimiter = ({
  name,
  rateLimit = {},
  options: { testRateLimit } = {},
}) => {
  if (shouldRateLimit(testRateLimit)) {
    const { limit, timeRange } = getRateLimit(rateLimit);
    DDPRateLimiter.addRule(
      {
        type: 'method',
        name,
        connectionId() {
          return true;
        },
      },
      limit,
      timeRange,
    );
  }
};
