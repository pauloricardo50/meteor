import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import rateLimit from '../../utils/rate-limit.js';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import { validateUser } from '../helpers';
import Properties from './properties';

export const insertProperty = new ValidatedMethod({
  name: 'properties.insert',
  mixins: [CallPromiseMixin],
  validate({ object }) {
    const { value, address, latitude, longitude } = object;
    check(object, Object);
    check(value, Number);
    check(address, String);
    check(latitude, Number);
    check(longitude, Number);

    validateUser();
  },
  run({ object }) {
    const { value, address, latitude, longitude } = object;

    return Properties.insert({
      userId: Meteor.userId(),
      name: address.split(',')[0],
      value,
      address,
      latitude,
      longitude,
    });
  },
});

export const deleteProperty = new ValidatedMethod({
  name: 'properties.delete',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
    validateUser();
  },
  run({ id }) {
    return Properties.remove(id);
  },
});

export const updateProperty = new ValidatedMethod({
  name: 'properties.update',
  mixins: [CallPromiseMixin],
  validate({ id, object }) {
    check(id, String);
    check(object, Object);

    validateUser();
  },
  run({ id, object }) {
    return Properties.update(id, { $set: object });
  },
});

export const setPropertyField = new ValidatedMethod({
  name: 'properties.setField',
  mixins: [CallPromiseMixin],
  validate({ id, key }) {
    check(id, String);
    check(key, String);

    validateUser();
  },
  run({ id, key, value }) {
    return Properties.update(id, { $set: { [`fields.${key}`]: value } });
  },
});
