import { Mongo } from 'meteor/mongo';
import { COLLECTIONS } from '../constants';

export const createCollection = (collectionName, schema) => {
  const Collection = new Mongo.Collection(collectionName);
  COLLECTIONS[collectionName] = collectionName;

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
