class SimpleSchemaStub {
  extend() {}
}

export const Mongo = {
  Collection: () => ({
    deny: () => {},
    allow: () => {},
    attachSchema: () => {},
    createQuery: name => ({ queryName: name }),
    simpleSchema: () => new SimpleSchemaStub(),
  }),
};
