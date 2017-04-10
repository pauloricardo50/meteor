import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoanRequests from '../loanrequests/loanrequests';

import Offers from './offers';

// Insert a new offer
export const insertOffer = new ValidatedMethod({
  name: 'offers.insert',
  validate: null,
  run({ object }) {
    const newObject = object;

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

    newObject.organization = user.profile.organization;
    newObject.email = user.emails[0].address;
    newObject.canton = user.profile.cantons[0];
    newObject.auctionEndTime = request.logic.auctionEndTime;

    Offers.insert(newObject);
  },
});

export const updateOffer = new ValidatedMethod({
  name: 'offers.update',
  validate: null,
  run({ object }) {
    Offers.update(object);
  },
});

export const insertFakeOffer = new ValidatedMethod({
  name: 'offers.insertFake',
  validate: null,
  run({ object }) {
    Offers.insert(object);
  },
});
