import { SecurityService } from '../..';
import OfferService from '../OfferService';
import { offerInsert, offerUpdate, offerDelete } from '../methodDefinitions';

offerInsert.setHandler((context, { offer, loanId, userId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OfferService.insert({ offer: { ...offer, loanId }, userId });
});

offerUpdate.setHandler((context, { offerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, object });
});

offerDelete.setHandler((context, { offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
