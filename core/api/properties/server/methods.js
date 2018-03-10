import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import Properties from '../properties';

// export const insertProperty = new ValidatedMethod({
//   name: 'propertyInsert',
//   mixins: [CallPromiseMixin],
//   validate({ object, userId }) {
//     check(object, Object);
//     if (userId) {
//       check(userId, String);
//     }
//   },
//   run({ object, userId }) {
//     return Properties.insert({
//       ...object,
//       userId: userId === undefined ? Meteor.userId() : userId,
//     });
//   },
// });

// export const deleteProperty = new ValidatedMethod({
//   name: 'propertyDelete',
//   mixins: [CallPromiseMixin],
//   validate({ id }) {
//     check(id, String);
//   },
//   run({ id }) {
//     return Properties.remove(id);
//   },
// });

// export const propertyUpdate = new ValidatedMethod({
//   name: 'propertyUpdate',
//   mixins: [CallPromiseMixin],
//   validate({ id, object }) {
//     check(id, String);
//     check(object, Object);
//   },
//   run({ id, object }) {
//     return Properties.update(id, { $set: object });
//   },
// });

// Lets you push a value to an array
export const pushPropertyValue = new ValidatedMethod({
  name: 'pushPropertyValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Properties.update(id, { $push: object });
  },
});

// Lets you pop a value from the end of an array
export const popPropertyValue = new ValidatedMethod({
  name: 'popPropertyValue',
  mixins: [CallPromiseMixin],
  validate({ id }) {
    check(id, String);
  },
  run({ object, id }) {
    return Properties.update(id, { $pop: object }, { getAutoValues: false });
  },
});

// export const setPropertyField = new ValidatedMethod({
//   name: 'setPropertyField',
//   mixins: [CallPromiseMixin],
//   validate({ id, key }) {
//     check(id, String);
//     check(key, String);
//   },
//   run({ id, key, value }) {
//     return Properties.update(id, { $set: { [`fields.${key}`]: value } });
//   },
// });
