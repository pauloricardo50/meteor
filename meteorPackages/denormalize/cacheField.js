import compact from 'lodash/compact';
import get from 'lodash/get';
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';

import { addMigration } from './migrations.js';

Mongo.Collection.prototype.cacheField = function(options) {
  check(options, {
    cacheField: String,
    fields: [String],
    transform: Match.Optional(Function),
    bypassSchema: Match.Optional(Boolean),
  });

  const collection =
    options.bypassSchema && Package['aldeed:collection2']
      ? this._collection
      : this;
  const { cacheField } = options;
  const { fields } = options;
  const topFields = uniq(map(fields, field => field.split('.')[0]));
  let { transform } = options;
  if (!transform) {
    transform = function(doc) {
      return compact(map(fields, field => get(doc, field))).join(', ');
    };
  }

  if (includes(topFields, cacheField.split(/[.:]/)[0])) {
    throw new Error(
      'watching the cacheField for changes would cause an infinite loop',
    );
  }

  function insertHook(userid, doc) {
    collection.update(doc._id, {
      $set: { [cacheField]: transform(pick(doc, fields)) },
    });
  }

  addMigration(collection, insertHook, options);

  collection.after.insert(insertHook);

  collection.after.update((userId, doc, changedFields) => {
    if (intersection(changedFields, topFields).length) {
      Meteor.defer(() => {
        collection.update(doc._id, {
          $set: { [cacheField]: transform(pick(doc, fields)) },
        });
      });
    }
  });
};
