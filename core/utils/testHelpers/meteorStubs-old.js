const stubs = {
  meteor: {
    Meteor: {
      defer: () => {},
      isServer: true,
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
    '@noCallThru': true,
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
    DDPRateLimiter: {
      addRule: () => {},
    },
    '@noCallThru': true,
    '@global': true,
  },
  meteorUnderscore: {
    _: {},
    '@noCallThru': true,
    '@global': true,
  },
  analytics: {
    track: () => {},
    '@noCallThru': true,
    '@global': true,
  },
  session: {
    Session: {},
    '@noCallThru': true,
    '@global': true,
  },
  cleanMethod: {
    default: () => {},
    '@noCallThru': true,
    '@global': true,
  },
  callpromiseMixin: {
    CallPromiseMixin: {},
    '@noCallThru': true,
    '@global': true,
  },
};

const meteorStubs = {
  'meteor/meteor': stubs.meteor,
  'meteor/mongo': stubs.mongo,
  'meteor/session': stubs.session,
  'meteor/themeteorchef:bert': stubs.bert,
  'meteor/mdg:validated-method': stubs.validatedMethod,
  'meteor/check': stubs.check,
  'meteor/alanning:roles': stubs.alanningRoles,
  'meteor/ddp-rate-limiter': stubs.ddpRateLimiter,
  'meteor/underscore': stubs.meteorUnderscore,
};

export default meteorStubs;
