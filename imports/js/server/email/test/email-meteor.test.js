import { expect } from 'chai';
import { describe, it, afterEach } from 'meteor/practicalmeteor:mocha';

import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import '/imports/api/users/methods';

// TODO: FUCK THIS SHIT
// describe('Email verification method', function() {
//   this.timeout(4000);
//
//   it('throws', done => {
//     const email = 'test@test.com';
//     const user = Meteor.users.findOne({ 'emails.address': email });
//     if (user) {
//       console.log('wuut', user);
//       Meteor.users.remove(user);
//     }
//
//     const userId = Accounts.createUser({
//       email,
//       password: 'password',
//     });
//
//     Meteor.call('sendVerificationLink', userId, (err, result) => {
//       if (err) {
//         done(err);
//       } else {
//         done();
//       }
//     });
//   });
// });
