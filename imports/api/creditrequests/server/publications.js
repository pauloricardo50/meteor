import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import CreditRequests from '../creditrequests.js';


// Publish a specific creditRequest with an ID
Meteor.publish('creditRequest', (id) => {
  check(id, String);


  // if (Roles.userIsInRole(this.userId, 'admin')) {
  //   return CreditRequests.find({
  //     _id: id,
  //   });
  // }

  return CreditRequests.find({
    userId: this.userId,
    _id: id,
  });

  // Throw unauthorized error
});


// Publish the currently active creditrequest
Meteor.publish('activeCreditRequest', function () {
  // find or findOne? Since there should only be one at any time..?
  const request = CreditRequests.find({
    userId: this.userId,
    active: true,
  });

  if (request) {
    return request;
  }

  return this.ready();
});


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


const partnerVisibleFields = { // TODO: Complete this
  requestName: 1,
  type: 1,

  'personalInfo.twoBuyers': 1,
  'personalInfo.age1': 1,
  'personalInfo.age2': 1,
  'personalInfo.gender1': 1,
  'personalInfo.gender2': 1,

  financialInfo: 1,

  propertyInfo: 1,

  'files.willUploadTaxes': 1,

  'logic.auctionStarted': 1,
  'logic.auctionStartTime': 1,
  'logic.auctionEndTime': 1,
};


// Publish all creditrequests this partner has access to
Meteor.publish('partnerRequests', function () {
  // TODO Verify if this partner is allowed to see this credit request

  return CreditRequests.find({
    // TODO add logic to filter requests
  }, {
    fields: partnerVisibleFields,
  });
});


// Publish the creditrequest with a specific ID, and only show the fields for an anonymous offer
Meteor.publish('partnerSingleCreditRequest', function (id) {
  check(id, String);

  // TODO Verify if this partner is allowed to see this credit request

  return CreditRequests.find({
    _id: id,
  }, {
    fields: partnerVisibleFields,
  });
});
