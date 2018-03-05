import { Offers } from 'core/api';
import Security from 'core/api/security';

export default class {
  static update = ({ offerId, offer }) =>
    Offers.update(offerId, { $set: offer });

  static insert = ({ offer, userId }) => Offers.insert({ ...offer, userId });

  static insertAdminOffer = ({ offer, loan, userId }) =>
    Offers.insert({
      ...offer,
      userId,
      isAdmin: true,
      auctionEndTime: loan.logic.auction.endTime,
      // this doesn't update when the loan is ended prematurely by an admin
      canton: 'GE',
      loanId: loan._id,
    });

  static remove = ({ offerId }) => Offers.remove(offerId);
}
