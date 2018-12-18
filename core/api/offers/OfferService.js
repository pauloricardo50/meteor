import Offers from '.';
import CollectionService from '../helpers/CollectionService';

export class OfferService extends CollectionService {
  constructor() {
    super(Offers);
  }

  update = ({ offerId, object }) => Offers.update(offerId, { $set: object });

  insert = ({ offer, userId }) => Offers.insert({ ...offer, userId });

  remove = ({ offerId }) => Offers.remove(offerId);
}

export default new OfferService();
