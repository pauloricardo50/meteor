import get from 'lodash/get';
import intersection from 'lodash/intersection';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import union from 'lodash/union';
import uniq from 'lodash/uniq';

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
  const watchedFields = union([referenceField], keys(selector));
  const topFields = uniq(watchedFields.map(field => field.split('.')[0]));

  if (referenceField.split(/[.:]/)[0] == cacheField.split(/[.:]/)[0]) {
    throw new Error(
      'referenceField and cacheField must not share the same top field',
    );
  }

  function update(child) {
    const ref = get(child, referenceField);
    if (ref) {
      const select = merge(selector, { [referenceField]: ref });
      parentCollection.update(
        { _id: ref },
        { $set: { [cacheField]: childCollection.find(select).count() } },
      );
    }
  }

  function insert(userId, parent) {
    const select = merge(selector, { [referenceField]: parent._id });
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
    if (intersection(changedFields, topFields).length) {
      update(child);
      update(this.previous);
    }
  });

  childCollection.after.remove((userId, child) => {
    update(child);
  });
};
