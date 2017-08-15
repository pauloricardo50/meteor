import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import LoanRequests from '../loanrequests';
import { Roles } from 'meteor/alanning:roles';

// Publish a specific loanRequest with an ID
Meteor.publish('loanRequest', function publish(id) {
  // Verify if user is logged In
  if (!Meteor.userId()) {
    return this.ready();
  }

  check(id, String);

  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return LoanRequests.find({
      _id: id,
    });
  }

  return LoanRequests.find({
    userId: Meteor.userId(),
    _id: id,
  });

  // Throw unauthorized error
});

// Publish all loanrequests from the current user
Meteor.publish('loanRequests', function publish() {
  // Verify if user is logged In
  if (!Meteor.userId()) {
    return this.ready();
  }

  return LoanRequests.find({
    userId: Meteor.userId(),
  });
});

// Publish all loanrequests in the database for admins
Meteor.publish('allLoanRequests', function publish() {
  // Verify if user is logged In
  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    // Return all users
    return LoanRequests.find();
  }

  return this.ready();
});

// The fields visible to partners
const partnerVisibleFields = organization => ({
  // TODO: Complete this
  'general.purchaseType': 1,
  'general.usageType': 1,
  'general.fortuneUsed': 1,
  'general.insuranceFortuneUsed': 1,
  'general.incomeUsed': 1,

  'borrowers.age': 1,
  'borrowers.gender': 1,
  'borrowers.birthDate': 1,
  'borrowers.grossIncome': 1,
  'borrowers.bonusExists': 1,
  'borrowers.bonus': 1,
  'borrowers.otherIncome': 1,
  'borrowers.currentRentExists': 1,
  'borrowers.currentRent': 1,
  'borrowers.realEstateFortune': 1,
  'borrowers.cashAndSecurities': 1,
  'borrowers.existingDebt': 1,
  'borrowers.otherFortune': 1,
  'borrowers.insuranceLpp': 1,
  'borrowers.insurance3A': 1,
  'borrowers.insurance3B': 1,
  'borrowers.insurancePureRisk': 1,

  property: 1,

  // partnerOffers: {
  //   $elemMatch: { $eq: { name: organization } },
  // },

  'logic.step': 1,
  'logic.uploadTaxesLater': 1,
  'logic.auctionStarted': 1,
  'logic.auctionStartTime': 1,
  'logic.auctionEndTime': 1,
});

// Publish all loanrequests this partner has access to
Meteor.publish('partnerRequestsAuction', function publish() {
  if (Roles.userIsInRole(Meteor.userId(), 'partner')) {
    const user = Meteor.users.findOne(Meteor.userId());

    // Show requests where the canton matches this partner's cantons
    // and the auction has started
    // and the auctionEndTime is greater than this date
    // and this partner's organization is not in the partnersToAvoid
    return LoanRequests.find(
      {
        $and: [
          { 'general.canton': { $in: user.profile.cantons } },
          { 'logic.auctionStarted': true },
          { 'logic.auctionEndTime': { $gt: new Date() } },
          {
            $or: [
              { 'general.partnersToAvoidExists': false },
              {
                'general.partnersToAvoid.0': { $ne: user.profile.organization },
              },
            ],
          },
        ],
      },
      {
        fields: partnerVisibleFields(user.profile.organization),
      },
    );
  }

  return this.ready();
});

// Publish all loanrequests this partner has access to
Meteor.publish('partnerRequestsCompleted', function publish() {
  if (Roles.userIsInRole(Meteor.userId(), 'partner')) {
    // Get the current partner user
    const user = Meteor.users.findOne(Meteor.userId());

    // Return the requests where this partner has been selected
    return LoanRequests.find(
      {
        'general.selectedPartner': user.profile.organization,
      },
      {
        fields: partnerVisibleFields(user.profile.organization),
      },
    );
  }

  return this.ready();
});

// Publish the loanrequest with a specific ID, and only show the fields for an anonymous offer
Meteor.publish('partnerSingleLoanRequest', function publish(id) {
  check(id, String);

  // Verify if this is a partner account
  if (Roles.userIsInRole(Meteor.userId(), 'partner')) {
    const user = Meteor.users.findOne(Meteor.userId());

    return LoanRequests.find(
      {
        $and: [
          { _id: id },
          { 'general.canton': { $in: user.profile.cantons } },
          { 'logic.auctionStarted': true },
          { 'logic.auctionEndTime': { $gt: new Date() } },
          {
            $or: [
              { 'general.partnersToAvoidExists': false },
              {
                'general.partnersToAvoid.0': { $ne: user.profile.organization },
              },
            ],
          },
        ],
      },
      {
        fields: partnerVisibleFields(user.profile.organization),
      },
    );
  }

  return this.ready();
});
