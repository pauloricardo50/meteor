import { Mongo } from 'meteor/mongo';
import { COLLECTIONS } from '../constants';

export const makeCollectionTransform = collectionName => doc => ({
  ...doc,
  _collection: collectionName,
});

export const initializeCollection = (collectionName, schema) => {
  const Collection = new Mongo.Collection(collectionName, {
    transform: makeCollectionTransform(collectionName),
  });

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

export const createCollection = (collectionName, schema) => {
  const Collection = initializeCollection(collectionName, schema);

  if (Object.values(COLLECTIONS).indexOf(collectionName) === -1) {
    throw new Error(
      `No collection "${collectionName}" found in 'COLLECTIONS' constant`,
    );
  }

  return Collection;
};
