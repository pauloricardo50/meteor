import { Mongo } from 'meteor/mongo';

export const makeCollectionTransform = collectionName => doc => ({
  ...doc,
  _collection: collectionName,
});

export const initializeCollection = (collectionName, schema) => {
  console.log('initializeCollection:', collectionName);
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

  return Collection;
};
