import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Match, check } from 'meteor/check';
import map from 'lodash/map';
import zipObject from 'lodash/zipObject';
import SecurityService from '../api/security/Security';

if (Meteor.isServer) {
  DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000);
    const seconds = time === 1 ? 'seconde' : 'secondes';
    return `Doucement l'ami, tu peux reessayer dans ${time} ${seconds}.`;
  });
}

const rateLimitedMethods = [];
const defaultLimit = 5;
const defaultTimeRange = 1000;

const roleLimiterCheckPattern = Match.Optional(Match.ObjectIncluding({
  limit: Match.Optional(Number),
  timeRange: Match.Optional(Number),
}));

const rateLimitCheckPattern = limitRoles => Match.ObjectIncluding(zipObject(
  limitRoles,
  map(limitRoles, () => roleLimiterCheckPattern),
));

const methodLimiterRule = ({ name, limitRoles = [], role = 'global' }) => ({
  userId: (userId) => {
    if (userId) {
      if (role !== 'global') {
        return SecurityService.hasRole(userId, role);
      }
      if (limitRoles.length > 1) {
        return !SecurityService.hasRole(userId, limitRoles);
      }
    }
    return true;
  },
  type: 'method',
  name,
});

export const getRateLimitedMethods = () => rateLimitedMethods;

export const setMethodLimiter = ({ name, rateLimit }) => {
  if (Meteor.isServer && !Meteor.isAppTest) {
    if (rateLimit) {
      const limitRoles = Object.keys(rateLimit);
      console.log( rateLimitCheckPattern(limitRoles))
      check(rateLimit, rateLimitCheckPattern(limitRoles));
      if (!limitRoles.length) {
        DDPRateLimiter.addRule(methodLimiterRule({
          name,
          limitRoles,
        }), defaultLimit, defaultTimeRange);
      } else {
        limitRoles.forEach((role) => {
          const {
            limit = defaultLimit,
            timeRange = defaultTimeRange,
          } = rateLimit[role];
          DDPRateLimiter.addRule(methodLimiterRule({
            name,
            role,
            limitRoles,
          }), limit, timeRange);
        });
      }
      rateLimitedMethods.push(name);
    }
  }
};
