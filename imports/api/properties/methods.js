import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Roles } from 'meteor/alanning:roles';

import { validateUser } from '../helpers';
import Properties from './properties';

export const insertProperty = new ValidatedMethod({
  name: 'properties.insert',
  validate({ value, address, latitude, longitude }) {
    check(value, Number);
    check(address, String);
    check(latitude, Number);
    check(longitude, Number);

    validateUser();
  },
  run({ value, address, latitude, longitude }) {
    return Properties.insert({
      name: address.split(',')[0],
      value,
      address,
      latitude,
      longitude,
    });
  },
});

export const updateProperty = new ValidatedMethod({
  name: 'properties.update',
  validate({ id, object }) {
    check(id, String);
    check(object, Object);

    validateUser();
  },
  run({ id, object }) {
    return Properties.update(id, { $set: object });
  },
});

export const setField = new ValidatedMethod({
  name: 'properties.setField',
  validate({ id, key }) {
    check(id, String);
    check(key, String);

    validateUser();
  },
  run({ id, key, value }) {
    return Properties.update(id, { $set: { [`fields.${key}`]: value } });
  },
});
