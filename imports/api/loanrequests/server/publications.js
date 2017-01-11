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
  'general.purchaseType': 1,
  'general.usageType': 1,
  'general.fortuneUsed': 1,
  'general.insuranceFortuneUsed': 1,
  'general.incomeUsed': 1,

  // 'borrowers.$.age': 1,
  // 'borrowers.$.gender': 1,

  // 'borrowers.0.age': 1,
  // 'borrowers.$': 1,
  // borrowers: {
  //   $elemMatch: { age: 1 },
  // },
  property: 1,

  'logic.uploadTaxesLater': 1,
  'logic.auctionStarted': 1,
  'logic.auctionStartTime': 1,
  'logic.auctionEndTime': 1,
};


// Publish all loanrequests this partner has access to
Meteor.publish('partnerRequestsAuction', function () {
  const user = Meteor.users.findOne(this.userId);
  const cantons = user.profile.cantons;
  const organization = user.profile.organization;

  // Show requests where the canton matches this partner's cantons
  // and the auction has started
  // and the auctionEndTime is greater than this date
  // and this partner's organization is not in the partnersToAvoid
  return LoanRequests.find(
    { $and: [
      { 'general.canton': { $in: cantons } },
      { 'logic.auctionStarted': true },
      { 'logic.auctionEndTime': { $gt: new Date() } },
      { $or: [
        { 'general.partnersToAvoidExists': false },
        { 'general.partnersToAvoid.0': { $ne: organization } },
      ] },
    ] },
    {
      fields: partnerVisibleFields,
    },
  );
});

// Publish all loanrequests this partner has access to
Meteor.publish('partnerRequestsCompleted', function () {
  // Get the current partner user
  const user = Meteor.users.findOne(this.userId);

  // Return the requests where this partner has been selected
  return LoanRequests.find({
    'general.selectedPartner': user.profile.organization,
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
