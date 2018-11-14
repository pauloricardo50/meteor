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

  _update({ id, object, operator = '$set' }) {
    if (Object.keys(object).length > 0) {
      return this.collection.update(id, { [operator]: object });
    }
    return null;
  }

  remove(id) {
    return this.collection.remove(id);
  }

  get(id) {
    return this.collection.findOne(id);
  }

  find(...args) {
    return this.collection.find(...args);
  }

  findOne(...args) {
    return this.collection.findOne(...args);
  }

  addLink({
    id,
    linkName,
    linkId,
    multi = true,
    hasMeta = true,
    metadata = {},
  }) {
    return this._update({
      id,
      object: { [linkName]: hasMeta ? { _id: linkId, ...metadata } : linkId },
      operator: multi ? '$push' : '$set',
    });
  }

  removeLink({ id, linkName, linkId }) {
    const doc = this.get(id);
    const link = doc[linkName];

    if (Array.isArray(link)) {
      return this._update({
        id,
        object: {
          [linkName]: link.filter(linkItem =>
            (linkItem._id ? linkItem._id !== linkId : linkItem !== linkId)),
        },
      });
    }

    return this._update({ id, object: { [linkName]: 1 }, operator: '$unset' });
  }

  getAssignedEmployee({ id }) {
    const { assignee } = this.collection
      .createQuery({ $filters: { _id: id }, assignee: 1 })
      .fetchOne();

    return assignee;
  }

  getAdditionalDocLabel({ label, additionalDoc }) {
    if (label) {
      return { label };
    }

    if (additionalDoc.label) {
      return { label: additionalDoc.label };
    }

    return {};
  }

  setAdditionalDoc({ id, additionalDocId, requiredByAdmin, label }) {
    const { additionalDocuments } = this.get(id);

    const additionalDoc = additionalDocuments.find(doc => doc.id === additionalDocId);

    if (additionalDoc) {
      const additionalDocumentsUpdate = [
        ...additionalDocuments.filter(doc => doc.id !== additionalDocId),
        {
          id: additionalDocId,
          requiredByAdmin,
          ...this.getAdditionalDocLabel({ label, additionalDoc }),
        },
      ];
      return this._update({
        id,
        object: { additionalDocuments: additionalDocumentsUpdate },
        operator: '$set',
      });
    }

    return this._update({
      id,
      object: {
        additionalDocuments: [
          ...additionalDocuments,
          { id: additionalDocId, requiredByAdmin, ...(label ? { label } : {}) },
        ],
      },
      operator: '$set',
    });
  }
}

export default CollectionService;
