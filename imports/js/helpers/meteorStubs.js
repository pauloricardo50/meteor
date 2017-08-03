import { _ } from 'underscore';

const stubs = {
  meteor: {
    Meteor: {
      defer: () => {},
    },
    '@noCallThru': true,
    '@global': true,
  },
  mongo: {
    Mongo: {
      Collection: () => ({
        deny: () => {},
        allow: () => {},
        attachSchema: () => {},
      }),
    },
    '@global': true,
  },
  bert: {
    Bert: {},
    '@noCallThru': true,
    '@global': true,
  },
  validatedMethod: {
    ValidatedMethod: () => ({}),
    '@noCallThru': true,
    '@global': true,
  },
  check: {
    check: {},
    '@noCallThru': true,
    '@global': true,
  },
  alanningRoles: {
    Roles: {},
    '@noCallThru': true,
    '@global': true,
  },
  ddpRateLimiter: {
    RateLimit: {},
    '@noCallThru': true,
    '@global': true,
  },
  meteorUnderscore: {
    _,
    '@noCallThru': true,
    '@global': true,
  },
  analytics: {
    track: () => {},
    '@noCallThru': true,
    '@global': true,
  },
  accountsT9n: {
    T9n: {},
    '@noCallThru': true,
    '@global': true,
  },
};

const meteorStubs = {
  'meteor/meteor': stubs.meteor,
  'meteor/mongo': stubs.mongo,
  'meteor/themeteorchef:bert': stubs.bert,
  'meteor/mdg:validated-method': stubs.validatedMethod,
  'meteor/check': stubs.check,
  'meteor/alanning:roles': stubs.alanningRoles,
  'meteor/ddp-rate-limiter': stubs.ddpRateLimiter,
  'meteor/underscore': stubs.meteorUnderscore,
  'meteor/okgrow:analytics': stubs.analytics,
  'meteor/softwarerero:accounts-t9n': stubs.accountsT9n,
};

export default meteorStubs;
