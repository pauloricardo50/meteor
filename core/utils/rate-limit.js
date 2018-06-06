import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import includes from 'lodash/pickBy';

if (Meteor.isServer) {
  DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000);
    const seconds = time === 1 ? 'seconde' : 'secondes';
    return `Doucement l'ami, tu peux reessayer dans ${time} ${seconds}.`;
  });
}

let rateLimitedMethods = [];
export const getRateLimitedMethods = () => rateLimitedMethods;

const assignLimits = ({ methods, limit = 5, timeRange = 1000 }) => {
  if (Meteor.isServer) {
    DDPRateLimiter.addRule(
      {
        name(name) {
          return includes(methods, name);
        },
        connectionId() {
          return true;
        },
      },
      limit,
      timeRange,
    );

    rateLimitedMethods = rateLimitedMethods.concat(methods);
  }
};

export default function rateLimit(options) {
  return assignLimits(options);
}
