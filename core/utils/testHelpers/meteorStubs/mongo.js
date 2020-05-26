class SimpleSchemaStub {
  extend() {}
}

const schema = new SimpleSchemaStub();

export const Mongo = {
  Collection: () => ({
    deny: () => {},
    allow: () => {},
    attachSchema: () => {},
    createQuery: name => ({ queryName: name }),
    simpleSchema: () => schema,
  }),
};
