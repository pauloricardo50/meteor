import { Meteor } from 'meteor/meteor';
import { Loans, Offers } from 'core/api';
import Security from 'core/api/security';

export default class {
  static update = ({ offerId, object }) =>
    Offers.update(offerId, { $set: object });

  static insert = ({ object, userId }) =>
    Offers.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId || Meteor.userId(),
    });

  static insertAdminOffer = (object) => {
    if (!Security.currentUserIsAdmin()) {
      return false;
    }

    const loan = Loans.findOne(object.loanId);

    return Offers.insert({
      ...object,
      userId: Meteor.userId(),
      isAdmin: true,
      auctionEndTime: loan.logic.auction.endTime,
      // this doesn't update when the loan is ended prematurely by an admin
      canton: 'GE',
    });
  };

  static remove = ({ offerId }) => Offers.remove(offerId);
}
