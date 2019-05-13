import { Meteor } from 'meteor/meteor';

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
      // debugger;
      return this.collection.update(id, { [operator]: object });
    }
    return null;
  }

  baseUpdate(...args) {
    return this.collection.update(...args);
  }

  remove(id) {
    return this.collection.remove(id);
  }

  get(id) {
    return this.collection.findOne(id);
  }

  safeGet(id) {
    const result = this.get(id);

    if (!result) {
      throw new Meteor.Error(`Could not find object with id "${id}" in collection "${
        this.collection._name
      }"`);
    }

    return result;
  }

  find(...args) {
    return this.collection.find(...args);
  }

  findOne(...args) {
    return this.collection.findOne(...args);
  }

  checkQuery(body) {
    if (body && body.$filter) {
      throw new Meteor.Error('$filter found in query body, did you mean $filters?');
    }
  }

  createQuery(...args) {
    this.checkQuery(args[0]);
    return this.collection.createQuery(...args);
  }

  fetchOne(...args) {
    this.checkQuery(args[0]);
    return this.createQuery(...args).fetchOne();
  }

  safeFetchOne(...args) {
    const { $filters = {} } = args.find(arg => arg.$filters);
    const result = this.fetchOne(...args);

    if (!result) {
      throw new Meteor.Error(`Could not find object with filters "${JSON.stringify($filters)}" in collection "${this.collection._name}"`);
    }

    return result;
  }

  fetch(...args) {
    this.checkQuery(args[0]);
    return this.createQuery(...args).fetch();
  }

  getLink(...args) {
    return this.collection.getLink(...args);
  }

  count(...args) {
    this.checkQuery(args[0]);
    return this.createQuery(...args).getCount();
  }

  countAll() {
    return this.find({}).count();
  }

  getAll() {
    return this.find({}).fetch();
  }

  get rawCollection() {
    return this.collection.rawCollection();
  }

  exists(_id) {
    return !!(_id && this.findOne({ _id }, { fields: { _id: 1 } }));
  }

  // Don't return the results from linker
  addLink({ id, linkName, linkId, metadata = {} }) {
    const linker = this.collection.getLink(id, linkName);
    const {
      linker: { strategy },
    } = linker;

    switch (strategy) {
    case 'one':
      linker.set(linkId);
      return;
    case 'many':
      linker.add(linkId);
      return;
    case 'one-meta':
      linker.set(linkId, metadata);
      return;
    case 'many-meta':
      linker.add(linkId, metadata);
      return;
    default:
      return null;
    }
  }

  // Don't return the results from linker
  removeLink({ id, linkName, linkId }) {
    const linker = this.getLink(id, linkName);
    const {
      linker: { strategy },
    } = linker;

    switch (strategy.split('-')[0]) {
    case 'one':
      linker.unset(linkId);
      return;
    case 'many':
      linker.remove(linkId);
      return;
    default:
      return null;
    }
  }

  updateLinkMetadata({ id, linkName, linkId, metadata }) {
    const linker = this.getLink(id, linkName);
    const {
      linker: { strategy },
    } = linker;

    switch (strategy.split('-')[0]) {
    case 'one':
      linker.metadata(metadata);
      return;
    case 'many':
      linker.metadata(linkId, metadata);
      return;
    default:
      return null;
    }
  }

  getAssignedEmployee({ id }) {
    const { assignee } = this.fetchOne({ $filters: { _id: id }, assignee: 1 });

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
    });
  }
}

export default CollectionService;
