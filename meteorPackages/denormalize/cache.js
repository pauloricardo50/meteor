import _ from 'lodash';
import { addMigration, migrate, autoMigrate } from './migrations.js';

export { migrate, autoMigrate };

function flattenFields(object, prefix) {
  prefix = prefix || '';
  let fields = [];
  _.each(object, (val, key) => {
    if (typeof val === 'object') {
      fields = _.union(fields, flattenFields(val, `${prefix + key}.`));
    } else {
      fields.push(prefix + key);
    }
  });
  return fields;
}

Mongo.Collection.prototype.cache = function(options) {
  check(options, {
    collection: Match.Where(
      collection => collection instanceof Mongo.Collection,
    ),
    fields: Match.OneOf([String], Object),
    type: Match.OneOf(
      'one',
      'many',
      'inversed',
      'inverse',
      'many-inversed',
      'many-inverse',
    ),
    referenceField: String,
    cacheField: String,
    bypassSchema: Match.Optional(Boolean),
  });
  if (options.type == 'inverse') options.type = 'inversed'; // Not sure which is best, so why not support both and be typo-friendly
  if (options.type == 'many-inverse') options.type = 'many-inversed';

  // Bypass collection2 schemas
  const parentCollection =
    options.bypassSchema && Package['aldeed:collection2']
      ? this._collection
      : this;
  const childCollection = options.collection;
  const { type } = options;
  let { referenceField } = options;
  const { cacheField } = options;
  let watchedFields = options.fields;

  if (referenceField.split(/[.:]/)[0] == cacheField.split(/[.:]/)[0]) {
    throw new Error(
      'referenceField and cacheField must not share the same top field',
    );
  }

  if (!_.isArray(watchedFields)) {
    watchedFields = flattenFields(watchedFields);
  }

  const childFields = _.clone(watchedFields);
  if (type !== 'one') {
    if (!_.includes(childFields, '_id')) {
      childFields.push('_id');
    }
    _.pull(childFields, referenceField);
  }
  const childOpts = { transform: null, fields: { _id: 0 } };
  _.each(childFields, field => (childOpts.fields[field] = 1));

  const parentOpts = { transform: null, fields: { _id: 1, [cacheField]: 1 } };
  if (type !== 'inversed' && type !== 'many-inversed') {
    parentOpts.fields[referenceField.split(':')[0]] = 1;
  }

  let idField;
  let referencePath;
  if (type == 'many' || type == 'many-inversed') {
    referencePath = referenceField.replace(':', '.');
    idField = referenceField.split(':')[1];
    referenceField = referenceField.split(':')[0];
  }

  if (
    type == 'inversed' ||
    (type == 'many-inversed' && !_.includes(watchedFields, referencePath))
  ) {
    watchedFields.push(referencePath || referenceField);
  }

  const topFields = _.uniq(watchedFields.map(field => field.split('.')[0]));

  function getNestedReferences(document) {
    // Used for nested references in "many" links
    let references = _.get(document, referenceField) || [];
    if (idField && references.length) {
      references = _.map(references, item => _.get(item, idField));
    }
    return _.uniq(_.flatten(references));
  }

  if (type == 'one') {
    const insert = function insert(userId, parent) {
      if (_.get(parent, referenceField)) {
        const child = childCollection.findOne(
          _.get(parent, referenceField),
          childOpts,
        );
        if (child) {
          parentCollection.update(parent._id, {
            $set: { [cacheField]: child },
          });
        }
      }
    };
    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);

    parentCollection.after.update(function(userId, parent, changedFields) {
      if (_.includes(changedFields, referenceField.split('.')[0])) {
        const child =
          _.get(parent, referenceField) &&
          childCollection.findOne(_.get(parent, referenceField), childOpts);
        if (child) {
          parentCollection.update(parent._id, {
            $set: { [cacheField]: child },
          });
        } else {
          parentCollection.update(parent._id, { $unset: { [cacheField]: 1 } });
        }
      }
    });

    childCollection.after.insert(function(userId, child) {
      const pickedChild = _.pick(child, childFields);
      parentCollection.update(
        { [referenceField]: child._id },
        { $set: { [cacheField]: pickedChild } },
        { multi: true },
      );
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        const pickedChild = _.pick(child, childFields);
        parentCollection.update(
          { [referenceField]: child._id },
          { $set: { [cacheField]: pickedChild } },
          { multi: true },
        );
      }
    });

    childCollection.after.remove(function(userId, child) {
      parentCollection.update(
        { [referenceField]: child._id },
        { $unset: { [cacheField]: 1 } },
        { multi: true },
      );
    });
  } else if (type == 'many') {
    const insert = function insert(userId, parent) {
      const references = getNestedReferences(parent);
      if (references.length) {
        const children = childCollection
          .find({ _id: { $in: references } }, childOpts)
          .fetch();
        parentCollection.update(parent._id, {
          $set: { [cacheField]: children },
        });
      } else {
        parentCollection.update(parent._id, { $set: { [cacheField]: [] } });
      }
    };
    addMigration(parentCollection, insert, options);
    parentCollection.after.insert(insert);

    parentCollection.after.update(function(userId, parent, changedFields) {
      if (_.includes(changedFields, referencePath.split('.')[0])) {
        const references = getNestedReferences(parent);
        if (references.length) {
          const children = childCollection
            .find({ _id: { $in: references } }, childOpts)
            .fetch();
          parentCollection.update(parent._id, {
            $set: { [cacheField]: children },
          });
        } else {
          parentCollection.update(parent._id, { $set: { [cacheField]: [] } });
        }
      }
    });

    childCollection.after.insert(function(userId, child) {
      const pickedChild = _.pick(child, childFields);
      parentCollection.update(
        { [referencePath]: child._id },
        { $push: { [cacheField]: pickedChild } },
        { multi: true },
      );
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        const pickedChild = _.pick(child, childFields);
        parentCollection
          .find({ [referencePath]: child._id }, parentOpts)
          .forEach(parent => {
            const index = _.findIndex(_.get(parent, cacheField), {
              _id: child._id,
            });
            if (index > -1) {
              parentCollection.update(parent._id, {
                $set: { [`${cacheField}.${index}`]: pickedChild },
              });
            } else {
              parentCollection.update(parent._id, {
                $push: { [cacheField]: pickedChild },
              });
            }
          });
      }
    });

    childCollection.after.remove(function(userId, child) {
      parentCollection.update(
        { [referencePath]: child._id },
        { $pull: { [cacheField]: { _id: child._id } } },
        { multi: true },
      );
    });
  } else if (type == 'inversed') {
    const insert = function insert(userId, parent) {
      const children = childCollection
        .find({ [referenceField]: parent._id }, childOpts)
        .fetch();
      parentCollection.update(parent._id, { $set: { [cacheField]: children } });
    };
    addMigration(parentCollection, insert, options);

    parentCollection.after.insert(insert);

    parentCollection.after.update(function(userId, parent, changedFields) {
      if (_.includes(changedFields, referenceField.split('.')[0])) {
        if (_.get(parent, referenceField)) {
          const children = childCollection
            .find({ [referenceField]: parent._id }, childOpts)
            .fetch();
          parentCollection.update(parent._id, {
            $set: { [cacheField]: children },
          });
        } else {
          parentCollection.update(parent._id, { $set: { [cacheField]: [] } });
        }
      }
    });

    childCollection.after.insert(function(userId, child) {
      const pickedChild = _.pick(child, childFields);
      if (_.get(child, referenceField)) {
        parentCollection.update(
          { _id: _.get(child, referenceField) },
          { $push: { [cacheField]: pickedChild } },
        );
      }
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        const pickedChild = _.pick(child, childFields);
        const previousId =
          this.previous && _.get(this.previous, referenceField);
        if (previousId && previousId !== _.get(child, referenceField)) {
          parentCollection.update(
            { _id: previousId },
            { $pull: { [cacheField]: { _id: child._id } } },
          );
        }
        parentCollection
          .find({ _id: _.get(child, referenceField) }, parentOpts)
          .forEach(parent => {
            const index = _.findIndex(_.get(parent, cacheField), {
              _id: child._id,
            });
            if (index > -1) {
              parentCollection.update(parent._id, {
                $set: { [`${cacheField}.${index}`]: pickedChild },
              });
            } else {
              parentCollection.update(parent._id, {
                $push: { [cacheField]: pickedChild },
              });
            }
          });
      }
    });

    childCollection.after.remove(function(userId, child) {
      parentCollection.update(
        { _id: _.get(child, referenceField) },
        { $pull: { [cacheField]: { _id: child._id } } },
      );
    });
  } else if (type == 'many-inversed') {
    const insert = function insert(userId, parent) {
      const children = childCollection
        .find({ [referencePath]: parent._id }, childOpts)
        .fetch();
      parentCollection.update(parent._id, { $set: { [cacheField]: children } });
    };
    addMigration(parentCollection, insert, options);

    parentCollection.after.insert(insert);

    parentCollection.after.update(function(userId, parent, changedFields) {
      if (_.includes(changedFields, referencePath.split('.')[0])) {
        const children = childCollection
          .find({ [referencePath]: parent._id }, childOpts)
          .fetch();
        parentCollection.update(parent._id, {
          $set: { [cacheField]: children },
        });
      }
    });

    childCollection.after.insert(function(userId, child) {
      const references = getNestedReferences(child);
      if (references.length) {
        const pickedChild = _.pick(child, childFields);
        parentCollection.update(
          { _id: { $in: references } },
          { $push: { [cacheField]: pickedChild } },
          { multi: true },
        );
      }
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (_.intersection(changedFields, topFields).length) {
        const references = getNestedReferences(child);
        let previousIds = this.previous && getNestedReferences(this.previous);
        previousIds = _.difference(previousIds, references);
        if (previousIds.length) {
          parentCollection.update(
            { _id: { $in: previousIds } },
            { $pull: { [cacheField]: { _id: child._id } } },
            { multi: true },
          );
        }
        if (references.length) {
          const pickedChild = _.pick(child, childFields);
          parentCollection
            .find({ _id: { $in: references } }, parentOpts)
            .forEach(parent => {
              const index = _.findIndex(_.get(parent, cacheField), {
                _id: child._id,
              });
              if (index > -1) {
                parentCollection.update(parent._id, {
                  $set: { [`${cacheField}.${index}`]: pickedChild },
                });
              } else {
                parentCollection.update(parent._id, {
                  $push: { [cacheField]: pickedChild },
                });
              }
            });
        }
      }
    });

    childCollection.after.remove(function(userId, child) {
      const references = getNestedReferences(child);
      if (references.length) {
        parentCollection.update(
          { _id: { $in: references } },
          { $pull: { [cacheField]: { _id: child._id } } },
          { multi: true },
        );
      }
    });
  }
};
