import FileService from '../../files/server/FileService';
import Offers from '../offers';
import OfferService from './OfferService';

Offers.before.remove((userId, { _id: offerId }) => {
  OfferService.cleanUpOffer({ offerId });
});

Offers.after.remove((userId, { _id }) => FileService.deleteAllFilesForDoc(_id));
