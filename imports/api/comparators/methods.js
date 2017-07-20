import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Roles } from 'meteor/alanning:roles';

import { validateUser } from '../helpers';
import Comparators from './comparators';

export const insertComparator = new ValidatedMethod({
  name: 'comparators.insert',
  validate() {
    validateUser();
  },
  run({}) {
    const userId = Meteor.userId();
    const userComparators = Comparators.find({ userId }).count();

    if (userComparators > 0) {
      throw new Meteor.Error("Can't have more than one comparator per user");
    }

    return Comparators.insert({ userId: Meteor.userId() });
  },
});

export const updateComparator = new ValidatedMethod({
  name: 'comparators.update',
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    validateUser();
  },
  run({ object, id }) {
    return Comparators.update(id, { $set: object });
  },
});

export const addComparatorField = new ValidatedMethod({
  name: 'comparators.addField',
  validate({ object, id }) {
    const { name, type } = object;

    check(id, String);
    check(name, String);
    check(type, String);
    validateUser();
  },
  run({ object, id }) {
    const { name, type } = object;

    const comparator = Comparators.findOne({ _id: id });

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
  name: 'comparators.removeField',
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    check(object.fieldId, String);
    validateUser();
  },
  run({ object, id }) {
    const { fieldId } = object;

    return Comparators.update(id, {
      $pull: { customFields: { id: fieldId } },
    });
  },
});

export const toggleHiddenField = new ValidatedMethod({
  name: 'comparators.toggleHiddenField',
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    check(object.fieldId, String);
    validateUser();
  },
  run({ object, id }) {
    const { fieldId } = object;

    const comparator = Comparators.findOne({ _id: id });

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
