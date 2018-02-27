import Offers from '../offers';

export default class {
  static update = ({ offerId, object }) =>
    Offers.update(offerId, { $set: object });

  static insert = ({ object, userId }) => Offers.insert({ ...object, userId });

  static remove = ({ offerId }) => Offers.remove(offerId);
}
