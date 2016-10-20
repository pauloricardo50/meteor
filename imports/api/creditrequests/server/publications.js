import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CreditRequests } from '../creditrequests.js';

//Publish a specific creditRequest with an ID
Meteor.publish('creditRequest', (id) => {
  check(id, String);


  // if (Roles.userIsInRole(this.userId, 'admin')) {
  //   return CreditRequests.find({
  //     _id: id,
  //   });
  // }

  return CreditRequests.find({
    _id: id,
  }, {
    userId: this.userId,
  });

  // Throw unauthorized error
});

// Publish the currently active creditrequest
// Meteor.publish('activeCreditRequest', () => {
//   // find or findOne? Since there should only be one at any time..?
//   return CreditRequests.findOne({
//     active: true,
//   }, {
//     userId: this.userId,
//   });
// });

// Publish all creditrequests from the current user
Meteor.publish('creditRequests', function () {
  // Verify if user is logged In
  if (!this.userId) {
    console.log('auth error');
  }

  return CreditRequests.find({
    userId: this.userId,
  });
});

// Publish all creditrequests in the database for admins
// Meteor.publish('allCreditRequests', () => {
//   // Verify if user is logged In
//   if (Roles.userIsInRole(this.userId, 'admin')) {
//     // Return all users
//     return CreditRequests.find();
//   }
//   return [];
// });

// Publish the creditrequest with a specific ID, and only show the fields for an anonymous offer
Meteor.publish('partnerCreditRequest', (id) => {
  check(id, String);

  // TODO Verify something? or public?

  return CreditRequests.find({
    _id: id,
  }, {
    fields: {
      salary: 1,
      fortune: 1,
      // add more!
    },
  });
});
