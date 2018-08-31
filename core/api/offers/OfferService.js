import { Offers } from 'core/api';

export class OfferService {
  update = ({ offerId, object }) => Offers.update(offerId, { $set: object });

  insert = ({ offer, userId }) => Offers.insert({ ...offer, userId });

  remove = ({ offerId }) => Offers.remove(offerId);

  getOfferById = offerId => Offers.findOne(offerId);
}

export default new OfferService();
