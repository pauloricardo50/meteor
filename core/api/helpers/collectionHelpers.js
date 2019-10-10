import { Mongo } from 'meteor/mongo';

export const createCollection = (collectionName, schema) => {
  const Collection = new Mongo.Collection(collectionName);

  Collection.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
  });

  Collection.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
  });

  if (schema) {
    Collection.attachSchema(schema);
  }

  return Collection;
};
