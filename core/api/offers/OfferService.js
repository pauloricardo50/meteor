import Offers from '.';
import CollectionService from '../helpers/CollectionService';

export class OfferService extends CollectionService {
  constructor() {
    super(Offers);
  }

  update = ({ offerId, object }) => Offers.update(offerId, { $set: object });

  insert = ({ offer: { lenderId, ...offer }, userId }) => {
    const offerId = Offers.insert({ ...offer, userId });
    this.addLink({ id: offerId, linkName: 'lender', linkId: lenderId });
    return offerId;
  };

  remove = ({ offerId }) => Offers.remove(offerId);
}

export default new OfferService();
