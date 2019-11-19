import _ from 'lodash';
import { addMigration } from './migrations.js';

Mongo.Collection.prototype.cacheCount = function(options) {
  check(options, {
    collection: Mongo.Collection,
    cacheField: String,
    referenceField: String,
    selector: Match.Optional(Object),
    bypassSchema: Match.Optional(Boolean),
  });

  const parentCollection =
    options.bypassSchema && Package['aldeed:collection2']
      ? this._collection
      : this;
  const childCollection = options.collection;
  const selector = options.selector || {};
  const { cacheField } = options;
  const { referenceField } = options;
  const watchedFields = _.union([referenceField], _.keys(selector));
  const topFields = _.uniq(watchedFields.map(field => field.split('.')[0]));

  if (referenceField.split(/[.:]/)[0] == cacheField.split(/[.:]/)[0]) {
    throw new Error(
      'referenceField and cacheField must not share the same top field',
    );
  }

  function update(child) {
    const ref = _.get(child, referenceField);
    if (ref) {
      const select = _.merge(selector, { [referenceField]: ref });
      parentCollection.update(
        { _id: ref },
        { $set: { [cacheField]: childCollection.find(select).count() } },
      );
    }
  }

  function insert(userId, parent) {
    const select = _.merge(selector, { [referenceField]: parent._id });
    parentCollection.update(parent._id, {
      $set: { [cacheField]: childCollection.find(select).count() },
    });
  }

  addMigration(parentCollection, insert, options);

  parentCollection.after.insert(insert);

  childCollection.after.insert((userId, child) => {
    update(child);
  });

  childCollection.after.update((userId, child, changedFields) => {
    if (_.intersection(changedFields, topFields).length) {
      update(child);
      update(this.previous);
    }
  });

  childCollection.after.remove((userId, child) => {
    update(child);
  });
};
