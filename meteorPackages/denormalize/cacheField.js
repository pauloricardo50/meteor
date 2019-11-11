import _ from 'lodash';
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
  const topFields = _.uniq(_.map(fields, field => field.split('.')[0]));
  let { transform } = options;
  if (!transform) {
    transform = function(doc) {
      return _.compact(_.map(fields, field => _.get(doc, field))).join(', ');
    };
  }

  if (_.includes(topFields, cacheField.split(/[.:]/)[0])) {
    throw new Error(
      'watching the cacheField for changes would cause an infinite loop',
    );
  }

  function insertHook(userid, doc) {
    collection.update(doc._id, {
      $set: { [cacheField]: transform(_.pick(doc, fields)) },
    });
  }

  addMigration(collection, insertHook, options);

  collection.after.insert(insertHook);

  collection.after.update((userId, doc, changedFields) => {
    if (_.intersection(changedFields, topFields).length) {
      Meteor.defer(() => {
        collection.update(doc._id, {
          $set: { [cacheField]: transform(_.pick(doc, fields)) },
        });
      });
    }
  });
};
