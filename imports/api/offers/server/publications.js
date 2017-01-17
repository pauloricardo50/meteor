import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Offers from '../offers.js';
import LoanRequests from '../../loanrequests/loanrequests';
import { Roles } from 'meteor/alanning:roles';


// Get all offers for the currently active request
Meteor.publish('activeOffers', function () {
  const activeRequest = LoanRequests.findOne({
    userId: this.userId,
    active: true,
  });

  return Offers.find({
    requestId: activeRequest._id,
  });
});


// Get all offers the partner has made
Meteor.publish('partnerOffers', function () {
  const user = Meteor.users.findOne({ _id: this.userId });

  if (Roles.userIsInRole(this.userId, 'partner')) {
    return Offers.find({
      organization: user.profile && user.profile.organization,
      // auctionEndTime: { $lt: new Date() },
    });
  }
});
