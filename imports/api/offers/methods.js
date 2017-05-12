import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoanRequests from '../loanrequests/loanrequests';
import { Roles } from 'meteor/alanning:roles';

import Offers from './offers';

// Insert a new offer
export const insertOffer = new ValidatedMethod({
  name: 'offers.insert',
  validate: null,
  run({ object }) {
    // Make sure there isn't already an offer for this request
    const user = Meteor.user();
    const offer = Offers.findOne({
      requestId: object.requestId,
      organization: user.profile.organization,
    });
    if (offer) {
      throw new Meteor.Error(
        'noTwoOffers',
        'Your organization has already made an offer on this request',
      );
    }

    const request = LoanRequests.findOne({ _id: object.requestId });

    object.organization = user.profile.organization;
    object.canton = user.profile.cantons[0];
    object.auctionEndTime = request.logic.auctionEndTime;

    return Offers.insert(object);
  },
});

export const insertAdminOffer = new ValidatedMethod({
  name: 'offers.insertAdmin',
  validate: null,
  run({ object }) {
    if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return false;
    }

    const request = LoanRequests.findOne({ _id: object.requestId });

    object.isAdmin = true;
    object.auctionEndTime = request.logic.auctionEndTime; // this doesn't update when the request is ended prematurely by an admin
    object.canton = 'GE';

    return Offers.insert(object);
  },
});

export const updateOffer = new ValidatedMethod({
  name: 'offers.update',
  validate: null,
  run({ object }) {
    return Offers.update(object);
  },
});

export const insertFakeOffer = new ValidatedMethod({
  name: 'offers.insertFake',
  validate: null,
  run({ object }) {
    return Offers.insert(object);
  },
});

export const deleteOffer = new ValidatedMethod({
  name: 'offers.delete',
  validate() {},
  run({ id }) {
    if (
      Roles.userIsInRole(Meteor.userId(), 'dev') ||
      Roles.userIsInRole(Meteor.userId(), 'admin')
    ) {
      return Offers.remove(id);
    }

    return false;
  },
});
