export const Mongo = {
  Collection: () => ({
    deny: () => {},
    allow: () => {},
    attachSchema: () => {},
    createQuery: name => ({ queryName: name }),
  }),
};
