import { Meteor } from 'meteor/meteor';
import { Offers } from 'core/api';
import Security from 'core/api/security';

export default class {
  static update = ({ offerId, object }) =>
    Offers.update(offerId, { $set: object });

  static insert = ({ object, userId }) => Offers.insert({ ...object, userId });

  static insertAdminOffer = ({ object, loan }) =>
    Offers.insert({
      ...object,
      userId: Meteor.userId(),
      isAdmin: true,
      auctionEndTime: loan.logic.auction.endTime,
      // this doesn't update when the loan is ended prematurely by an admin
      canton: 'GE',
    });

  static remove = ({ offerId }) => Offers.remove(offerId);
}
