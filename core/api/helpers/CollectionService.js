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

  createQuery(...args) {
    return this.collection.createQuery(...args);
  }

  fetchOne(...args) {
    return this.createQuery(...args).fetchOne();
  }

  fetch(...args) {
    return this.createQuery(...args).fetch();
  }

  getLink(...args) {
    return this.collection.getLink(...args);
  }

  count(...args) {
    return this.collection.createQuery(...args).count();
  }

  countAll() {
    return this.find({}).count();
  }

  getAll() {
    return this.find({}).fetch();
  }

  addLink({ id, linkName, linkId, metadata = {} }) {
    const linker = this.collection.getLink(id, linkName);
    const {
      linker: { strategy },
    } = linker;

    switch (strategy) {
    case 'one':
      return linker.set(linkId);
    case 'many':
      return linker.add(linkId);
    case 'one-meta':
      return linker.set(linkId, metadata);
    case 'many-meta':
      return linker.add(linkId, metadata);
    default:
      return null;
    }
  }

  removeLink({ id, linkName, linkId }) {
    const linker = this.collection.getLink(id, linkName);
    const {
      linker: { strategy },
    } = linker;

    switch (strategy.split('-')[0]) {
    case 'one':
      return linker.unset(linkId);
    case 'many':
      return linker.remove(linkId);
    default:
      return null;
    }
  }

  getAssignedEmployee({ id }) {
    const { assignee } = this.collection
      .createQuery({ $filters: { _id: id }, assignee: 1 })
      .fetchOne();

    return assignee;
  }

  getAdditionalDocLabel({ label, additionalDoc }) {
    if (label) {
      return label;
    }
    if (additionalDoc.label) {
      return additionalDoc.label;
    }

    return undefined;
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
          label: this.getAdditionalDocLabel({ label, additionalDoc }),
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
          { id: additionalDocId, requiredByAdmin, label },
        ],
      },
      operator: '$set',
    });
  }
}

export default CollectionService;
