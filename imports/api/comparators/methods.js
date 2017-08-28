import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import rateLimit from '/imports/js/helpers/rate-limit.js';

import { validateUser } from '../helpers';
import Comparators from './comparators';

export const insertComparator = new ValidatedMethod({
  name: 'comparators.insert',
  mixins: [CallPromiseMixin],
  validate() {
    validateUser();
  },
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
  name: 'comparators.update',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    check(object, Object);
    check(id, String);
    validateUser();
  },
  run({ object, id }) {
    return Comparators.update(id, { $set: object });
  },
});

export const addComparatorField = new ValidatedMethod({
  name: 'comparators.addField',
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    const { name, type } = object;

    check(id, String);
    check(name, String);
    check(type, String);
    validateUser();
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
  name: 'comparators.removeField',
  mixins: [CallPromiseMixin],
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
  mixins: [CallPromiseMixin],
  validate({ object, id }) {
    check(id, String);
    check(object, Object);
    check(object.fieldId, String);
    validateUser();
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
