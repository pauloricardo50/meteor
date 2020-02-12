// Meteor mock to be able to use our core library

class CollectionStub {
  deny() {}

  allow() {}

  attachSchema() {}
}

module.exports = {
  Meteor: {
    settings: { public: { subdomains: {} } },
    users: new CollectionStub(),
  },
  check: {},
  Mutation: class {},
  Match: { Optional: () => {}, Maybe: () => {}, OneOf: () => {} },
  Mongo: {
    Collection: CollectionStub,
  },
};
