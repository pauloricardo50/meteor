import SecurityService from '../../security';
import OfferService from '../OfferService';
import { offerInsert, offerUpdate, offerDelete } from '../methodDefinitions';

offerInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OfferService.insert(params);
});

offerUpdate.setHandler((context, params) => {
  SecurityService.offers.isAllowedToUpdate(params.offerId);
  return OfferService.update(params);
});

offerDelete.setHandler((context, params) => {
  SecurityService.offers.isAllowedToDelete(params.offerId);
  return OfferService.remove(params);
});
