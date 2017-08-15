import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoanRequests from '../loanrequests/loanrequests';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';

import Offers from './offers';

// Insert a new offer
export const insertOffer = new ValidatedMethod({
  name: 'offers.insert',
  validate({ object, userId }) {
    check(object, Object);
    check(userId, Match.Optional(String));
  },
  run({ object, userId }) {
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

    object.userId = userId || Meteor.userId();
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
    if (
      !(
        Roles.userIsInRole(Meteor.userId(), 'admin') ||
        Roles.userIsInRole(Meteor.userId(), 'dev')
      )
    ) {
      return false;
    }

    const request = LoanRequests.findOne({ _id: object.requestId });

    object.userId = Meteor.userId();
    object.isAdmin = true;
    object.auctionEndTime = request.logic.auctionEndTime; // this doesn't update when the request is ended prematurely by an admin
    object.canton = 'GE';

    return Offers.insert(object);
  },
});

export const updateOffer = new ValidatedMethod({
  name: 'offers.update',
  validate({ id, object }) {
    check(id, String);
    check(object, Object);
  },
  run({ id, object }) {
    return Offers.update(id, { $set: object });
  },
});

export const insertFakeOffer = new ValidatedMethod({
  name: 'offers.insertFake',
  validate: null,
  run({ object }) {
    return Offers.insert({ ...object, userId: Meteor.userId() });
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

rateLimit({
  methods: [
    insertOffer,
    insertAdminOffer,
    updateOffer,
    insertFakeOffer,
    deleteOffer,
  ],
});
