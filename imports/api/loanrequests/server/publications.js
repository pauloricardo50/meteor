import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import LoanRequests from '../loanrequests.js';
import { Roles } from 'meteor/alanning:roles';


// Publish a specific loanRequest with an ID
Meteor.publish('loanRequest', function (id) {
  check(id, String);


  if (Roles.userIsInRole(this.userId, 'admin')) {
    return LoanRequests.find({
      _id: id,
    });
  }

  return LoanRequests.find({
    userId: this.userId,
    _id: id,
  });

  // Throw unauthorized error
});


// Publish the currently active loanrequest
Meteor.publish('activeLoanRequest', function () {
  // find or findOne? Since there should only be one at any time..?
  const request = LoanRequests.find({
    userId: this.userId,
    active: true,
  });

  if (request) {
    return request;
  }

  return this.ready();
});


// Publish all loanrequests from the current user
Meteor.publish('loanRequests', function () {
  // Verify if user is logged In
  if (!this.userId) {
    console.log('auth error');
  }

  return LoanRequests.find({
    userId: this.userId,
  });
});


// Publish all loanrequests in the database for admins
Meteor.publish('allLoanRequests', function () {
  // Verify if user is logged In
  if (Roles.userIsInRole(this.userId, 'admin')) {
    // Return all users
    return LoanRequests.find();
  }

  return this.ready();
});


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


// Publish all loanrequests this partner has access to
Meteor.publish('partnerRequests', function () {
  // TODO Verify if this partner is allowed to see this loan request

  return LoanRequests.find({
    // TODO add logic to filter requests
  }, {
    fields: partnerVisibleFields,
  });
});


// Publish the loanrequest with a specific ID, and only show the fields for an anonymous offer
Meteor.publish('partnerSingleLoanRequest', function (id) {
  check(id, String);

  // Verify if this is a partner account
  if (Roles.userIsInRole(this.userId, 'partner')) {
    // TODO Make sure this partner is allowed to see this request by checking the bank name
    return LoanRequests.find({
      _id: id,
    }, {
      fields: partnerVisibleFields,
    });
  }
});
