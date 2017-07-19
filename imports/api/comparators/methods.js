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
  validate({ object }) {
    check(object, Object);
    validateUser();
  },
  run({ object }) {
    const userId = Meteor.userId();
    const comparator = Comparators.find({ userId });

    return Comparators.update(comparator._id, { $set: object });
  },
});

export const addComparatorField = new ValidatedMethod({
  name: 'comparators.addField',
  validate({ name }) {
    check(name, String);
    validateUser();
  },
  run({ name }) {
    const userId = Meteor.userId();
    const comparator = Comparators.find({ userId });

    return Comparators.update(comparator._id, {
      $inc: { customFieldCount: 1 },
      $push: {
        customFields: { id: `custom${comparator.customFieldCount}`, name },
      },
    });
  },
});

export const removeComparatorField = new ValidatedMethod({
  name: 'comparators.removeField',
  validate({ id }) {
    check(id, String);
    validateUser();
  },
  run({ id }) {
    const userId = Meteor.userId();
    const comparator = Comparators.find({ userId });

    return Comparators.update(comparator._id, {
      $pull: { customFields: { id } },
    });
  },
});
