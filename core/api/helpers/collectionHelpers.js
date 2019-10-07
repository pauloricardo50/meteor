export const createCollection = (collectionName) => {
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

  return Collection;
};
