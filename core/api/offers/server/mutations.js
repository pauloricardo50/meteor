import { SecurityService, createMutator } from '../..';
import OfferService from '../OfferService';
import * as defs from '../mutationDefinitions';

createMutator(defs.OFFER_INSERT, ({ object, userId }) => {
  SecurityService.checkLoggedIn();
  return OfferService.insert({ object, userId });
});

createMutator(defs.OFFER_UPDATE, ({ borrowerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(borrowerId);
  return OfferService.update({ borrowerId, object });
});

createMutator(defs.OFFER_DELETE, ({ borrowerId }) => {
  SecurityService.offers.isAllowedToDelete(borrowerId);
  return OfferService.remove({ borrowerId });
});
