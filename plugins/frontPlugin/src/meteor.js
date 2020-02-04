// Meteor mock to be able to use our core library

module.exports = {
  Meteor: { settings: { public: { subdomains: {} } } },
  check: {},
  Mutation: class {},
  Match: { Optional: () => {}, Maybe: () => {}, OneOf: () => {} },
};
