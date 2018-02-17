import { SecurityService, createMutator } from '../..';
import OfferService from '../OfferService';
import * as defs from '../mutationDefinitions';

createMutator(defs.OFFER_INSERT, ({ object, userId }) => {
  SecurityService.checkLoggedIn();
  return OfferService.insert({ object, userId });
});

createMutator(defs.OFFER_UPDATE, ({ offerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, object });
});

createMutator(defs.OFFER_DELETE, ({ offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
