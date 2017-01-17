import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Offers from '../offers.js';
import LoanRequests from '../../loanrequests/loanrequests';
import { Roles } from 'meteor/alanning:roles';


// Publish a specific loanRequest with an ID
Meteor.publish('offers', function () {
  const user = Meteor.users.findOne({ _id: this.userId });

  if (Roles.userIsInRole(this.userId, 'partner')) {
    return Offers.find({
      organization: user.profile && user.profile.organization,
    });
  }
});


// Meteor.publish('requestOffers', function () {
//   // publish all offers for this request
// });
