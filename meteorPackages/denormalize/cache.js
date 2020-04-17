import clone from 'lodash/clone';
import difference from 'lodash/difference';
import each from 'lodash/each';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import union from 'lodash/union';
import uniq from 'lodash/uniq';

import { addMigration, autoMigrate, migrate } from './migrations.js';

export { migrate, autoMigrate };

function flattenFields(object, prefix) {
  prefix = prefix || '';
  let fields = [];
  each(object, (val, key) => {
    if (typeof val === 'object') {
      fields = union(fields, flattenFields(val, `${prefix + key}.`));
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

  if (!isArray(watchedFields)) {
    watchedFields = flattenFields(watchedFields);
  }

  const childFields = clone(watchedFields);
  if (type !== 'one') {
    if (!includes(childFields, '_id')) {
      childFields.push('_id');
    }
    pull(childFields, referenceField);
  }
  const childOpts = { transform: null, fields: { _id: 0 } };
  each(childFields, field => (childOpts.fields[field] = 1));

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
    (type == 'many-inversed' && !includes(watchedFields, referencePath))
  ) {
    watchedFields.push(referencePath || referenceField);
  }

  const topFields = uniq(watchedFields.map(field => field.split('.')[0]));

  function getNestedReferences(document) {
    // Used for nested references in "many" links
    let references = get(document, referenceField) || [];
    if (idField && references.length) {
      references = map(references, item => get(item, idField));
    }
    return uniq(flatten(references));
  }

  if (type == 'one') {
    const insert = function insert(userId, parent) {
      if (get(parent, referenceField)) {
        const child = childCollection.findOne(
          get(parent, referenceField),
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
      if (includes(changedFields, referenceField.split('.')[0])) {
        const child =
          get(parent, referenceField) &&
          childCollection.findOne(get(parent, referenceField), childOpts);
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
      const pickedChild = pick(child, childFields);
      parentCollection.update(
        { [referenceField]: child._id },
        { $set: { [cacheField]: pickedChild } },
        { multi: true },
      );
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (intersection(changedFields, topFields).length) {
        const pickedChild = pick(child, childFields);
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
      if (includes(changedFields, referencePath.split('.')[0])) {
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
      const pickedChild = pick(child, childFields);
      parentCollection.update(
        { [referencePath]: child._id },
        { $push: { [cacheField]: pickedChild } },
        { multi: true },
      );
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (intersection(changedFields, topFields).length) {
        const pickedChild = pick(child, childFields);
        parentCollection
          .find({ [referencePath]: child._id }, parentOpts)
          .forEach(parent => {
            const index = findIndex(get(parent, cacheField), {
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
      if (includes(changedFields, referenceField.split('.')[0])) {
        if (get(parent, referenceField)) {
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
      const pickedChild = pick(child, childFields);
      if (get(child, referenceField)) {
        parentCollection.update(
          { _id: get(child, referenceField) },
          { $push: { [cacheField]: pickedChild } },
        );
      }
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (intersection(changedFields, topFields).length) {
        const pickedChild = pick(child, childFields);
        const previousId = this.previous && get(this.previous, referenceField);
        if (previousId && previousId !== get(child, referenceField)) {
          parentCollection.update(
            { _id: previousId },
            { $pull: { [cacheField]: { _id: child._id } } },
          );
        }
        parentCollection
          .find({ _id: get(child, referenceField) }, parentOpts)
          .forEach(parent => {
            const index = findIndex(get(parent, cacheField), {
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
        { _id: get(child, referenceField) },
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
      if (includes(changedFields, referencePath.split('.')[0])) {
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
        const pickedChild = pick(child, childFields);
        parentCollection.update(
          { _id: { $in: references } },
          { $push: { [cacheField]: pickedChild } },
          { multi: true },
        );
      }
    });

    childCollection.after.update(function(userId, child, changedFields) {
      if (intersection(changedFields, topFields).length) {
        const references = getNestedReferences(child);
        let previousIds = this.previous && getNestedReferences(this.previous);
        previousIds = difference(previousIds, references);
        if (previousIds.length) {
          parentCollection.update(
            { _id: { $in: previousIds } },
            { $pull: { [cacheField]: { _id: child._id } } },
            { multi: true },
          );
        }
        if (references.length) {
          const pickedChild = pick(child, childFields);
          parentCollection
            .find({ _id: { $in: references } }, parentOpts)
            .forEach(parent => {
              const index = findIndex(get(parent, cacheField), {
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
