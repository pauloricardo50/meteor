class CollectionService {
  constructor(collection) {
    if (!collection) {
      throw new Error('A collection is needed in CollectionService, but none was passed');
    }
    this.collection = collection;
  }

  insert(object = {}) {
    return this.collection.insert(object);
  }

  update({ id, object, operator = '$set' }) {
    return this.collection.update(id, { [operator]: object });
  }

  remove(id) {
    return this.collection.remove(id);
  }

  get(id) {
    return this.collection.findOne(id);
  }

  addLink({
    id,
    linkName,
    linkId,
    multi = true,
    hasMeta = true,
    metadata = {},
  }) {
    return this.update({
      id,
      object: { [linkName]: hasMeta ? { _id: linkId, ...metadata } : linkId },
      operator: multi ? '$push' : '$set',
    });
  }
}

export default CollectionService;
