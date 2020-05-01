import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000);
    const seconds = time === 1 ? 'seconde' : 'secondes';
    return `Doucement, tu peux reessayer dans ${time} ${seconds}.`;
  });
}

const shouldRateLimit = testRateLimit =>
  Meteor.isServer && (!Meteor.isAppTest || testRateLimit);

const defaultLimit = 5;
const defaultTimeRange = 1000;

export const setMethodLimiter = ({
  name,
  rateLimit: { limit = defaultLimit, timeRange = defaultTimeRange } = {},
  testRateLimit,
}) => {
  if (shouldRateLimit(testRateLimit)) {
    DDPRateLimiter.addRule({ type: 'method', name }, limit, timeRange);
  }
};
