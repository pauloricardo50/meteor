import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

// DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
//   const time = Math.ceil(timeToReset / 1000);
//   const seconds = time === 1 ? 'second' : 'seconds';
//   return `Easy on the gas, buddy. Too many requests. Try again in ${time} ${seconds}.`;
// });

const fetchMethodNames = methods => _.pluck(methods, 'name');

const assignLimits = ({ methods, limit = 5, timeRange = 1000 }) => {
  const methodNames = fetchMethodNames(methods);

  if (Meteor.isServer) {
    DDPRateLimiter.addRule(
      {
        name(name) {
          return _.contains(methodNames, name);
        },
        connectionId() {
          return true;
        },
      },
      limit,
      timeRange,
    );
  }
};

export default function rateLimit(options) {
  return assignLimits(options);
}
