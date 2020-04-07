import { Meteor } from 'meteor/meteor';
import { migrate } from 'meteor/herteby:denormalize';
import { Random } from 'meteor/random';

import { createMeteorAsyncFunction } from '../helpers';

class CollectionService {
  constructor(collection, { autoValues } = {}) {
    if (!collection) {
      throw new Error(
        'A collection is needed in CollectionService, but none was passed',
      );
    }

    if (autoValues) {
      // Pass an object with fields and their respective server-side autovalues
      // This lets you add server-only autoValues
      const schema = collection.simpleSchema();
      const extendedSchema = Object.keys(autoValues).reduce(
        (obj, key) => ({ ...obj, [key]: { autoValue: autoValues[key] } }),
        {},
      );
      collection.attachSchema(schema.extend(extendedSchema));
    }

    this.collection = collection;
  }

  insert(object = {}, ...args) {
    return this.collection.insert(object, ...args);
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

  remove(...args) {
    return this.collection.remove(...args);
  }

  get(filters, fragment) {
    if (!fragment) {
      throw new Meteor.Error(
        `Should provide a fragment for get in ${this.collection._name}Service`,
      );
    }
    if (!filters) {
      return undefined;
    }
    // When fetching by id
    if (typeof filters === 'string') {
      filters = { _id: filters };
    }

    return this.fetchOne({
      $filters: filters,
      ...fragment,
    });
  }

  find(...args) {
    return this.collection.find(...args);
  }

  findOne(...args) {
    return this.collection.findOne(...args);
  }

  checkQuery(body) {
    if (body && body.$filter) {
      throw new Meteor.Error(
        '$filter found in query body, did you mean $filters?',
      );
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
      throw new Meteor.Error(
        `Could not find object with filters "${JSON.stringify(
          $filters,
        )}" in collection "${this.collection._name}"`,
      );
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

  exists(filters) {
    return !!(filters && this.find(filters, { _id: 1 }).count());
  }

  aggregate(pipeline, options) {
    const aggregate = createMeteorAsyncFunction(() =>
      this.rawCollection.aggregate(pipeline, options).toArray(),
    );
    return aggregate();
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

  getAdditionalDocLabel({ label, additionalDoc }) {
    if (label) {
      return label;
    }
    if (additionalDoc.label) {
      return additionalDoc.label;
    }

    return undefined;
  }

  setAdditionalDoc({
    id,
    additionalDocId,
    requiredByAdmin,
    label,
    category,
    tooltip,
  }) {
    const { additionalDocuments } = this.get(id, { additionalDocuments: 1 });

    const additionalDoc = additionalDocuments.find(
      doc => doc.id === additionalDocId,
    );

    if (additionalDoc) {
      const additionalDocumentsUpdate = [
        ...additionalDocuments.filter(doc => doc.id !== additionalDocId),
        {
          id: additionalDocId,
          requiredByAdmin,
          label: this.getAdditionalDocLabel({ label, additionalDoc }),
          category,
          tooltip,
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
          { id: additionalDocId, requiredByAdmin, label, category, tooltip },
        ],
      },
    });
  }

  removeAdditionalDoc({ id: docId, additionalDocId }) {
    const { additionalDocuments = [] } = this.get(docId, {
      additionalDocuments: 1,
    });
    return this._update({
      id: docId,
      object: {
        additionalDocuments: additionalDocuments.filter(
          ({ id }) => id !== additionalDocId,
        ),
      },
    });
  }

  distinct(key, query = {}, options = {}) {
    const func = createMeteorAsyncFunction(
      this.rawCollection.distinct.bind(this.rawCollection),
    );
    return func(key, query, options);
  }

  rawInsert(doc = {}) {
    const _id = doc._id || Random.id();
    const func = createMeteorAsyncFunction(
      this.rawCollection.insert.bind(this.rawCollection),
    );
    return func({ ...doc, _id });
  }

  cache(options, migrationSelector) {
    this.collection.cache(options);
    this.migrateCache(options, migrationSelector);
  }

  cacheField(options, migrationSelector) {
    this.collection.cacheField(options);
    this.migrateCache(options, migrationSelector);
  }

  cacheCount(options, migrationSelector) {
    this.collection.cacheCount(options);
    this.migrateCache(options, migrationSelector);
  }

  migrateCache(options, migrationSelector) {
    if (migrationSelector) {
      Meteor.startup(() => {
        migrate(this.collection._name, options.cacheField, migrationSelector);
      });
    }
  }
}

export default CollectionService;
