import Offers from '../offers';
import OfferService from './OfferService';

Offers.before.remove((userId, { _id: offerId }) => {
  OfferService.cleanUpOffer({ offerId });
});
