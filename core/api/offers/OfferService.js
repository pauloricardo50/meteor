import { Offers } from 'core/api';

export default class {
  static update = ({ offerId, object }) =>
    Offers.update(offerId, { $set: object });

  static insert = ({ offer, userId }) => Offers.insert({ ...offer, userId });

  static insertAdminOffer = ({ offer, loanId, userId }) =>
    Offers.insert({
      ...offer,
      loanId,
      userId,
      canton: 'GE',
    });

  static remove = ({ offerId }) => Offers.remove(offerId);
}
