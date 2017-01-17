import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';


import Offers from './offers';

// Insert a new offer
export const insertOffer = new ValidatedMethod({
  name: 'offers.insert',
  validate: null,
  run({ object }) {
    const newObject = object;
    // Make sure there isn't already an offer for this request
    const user = Meteor.user();
    const offers = Offers.find({
      requestId: object.requestId,
      organization: user.profile.organization,
    });

    newObject.organization = user.profile.organization;
    newObject.email = user.emails[0].address;
    newObject.canton = user.profile.cantons[0];

    if (offers.length > 0) {
      throw new Meteor.Error('noTwoOffers', 'Your organization has already made an offer on this request');
    }

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
