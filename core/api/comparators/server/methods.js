import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '../../../utils/rate-limit.js';

import Comparators from '../comparators';

export const insertComparator = new ValidatedMethod({
  name: 'insertComparator',
  mixins: [CallPromiseMixin],
  validate() {},
  run() {
    const userId = Meteor.userId();
    const userComparators = Comparators.find({ userId }).count();

    if (userComparators > 0) {
      throw new Meteor.Error("Can't have more than one comparator per user");
    }

    return Comparators.insert({ userId });
  },
});

export const updateComparator = new ValidatedMethod({
  name: 'updateComparator',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    check(object, Object);
    check(id, String);
  },
  run({ object, id }) {
    return Comparators.update(id, { $set: object });
  },
});

export const addComparatorField = new ValidatedMethod({
  name: 'addComparatorField',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    const { name, type } = object;

    check(id, String);
    check(name, String);
    check(type, String);
  },
  run({ object, id }) {
    const { name, type } = object;

    const comparator = Comparators.findOne(id);

    return Comparators.update(id, {
      $inc: { customFieldCount: 1 },
      $push: {
        customFields: {
          id: `custom${comparator.customFieldCount}`,
          name,
          type,
        },
      },
    });
  },
});

export const removeComparatorField = new ValidatedMethod({
  name: 'removeComparatorField',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    check(object.fieldId, String);
  },
  run({ object, id }) {
    const { fieldId } = object;

    return Comparators.update(id, {
      $pull: { customFields: { id: fieldId } },
    });
  },
});

export const toggleHiddenField = new ValidatedMethod({
  name: 'toggleHiddenField',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    check(object.fieldId, String);
  },
  run({ object, id }) {
    const { fieldId } = object;

    const comparator = Comparators.findOne(id);

    if (comparator.hiddenFields.indexOf(fieldId) >= 0) {
      // Field is currently hidden
      return Comparators.update(id, {
        $pull: { hiddenFields: fieldId },
      });
    }

    return Comparators.update(id, {
      $push: { hiddenFields: fieldId },
    });
  },
});
