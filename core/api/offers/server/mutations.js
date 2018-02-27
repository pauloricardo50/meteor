import { Meteor } from 'meteor/meteor';

import { SecurityService, createMutator } from '../..';
import OfferService from '../OfferService';
import * as defs from '../mutationDefinitions';

createMutator(defs.OFFER_INSERT, ({ object, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.offers.isAllowedToInsert();
  }

  return OfferService.insert({
    object,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

createMutator(defs.OFFER_INSERT_ADMIN, ({ object, loan }) => {
  SecurityService.checkLoggedIn();
  if (SecurityService.currentUserIsAdmin()) {
    return OfferService.insertAdminOffer({ object, loan });
  }
  return null;
});

createMutator(defs.OFFER_UPDATE, ({ offerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, object });
});

createMutator(defs.OFFER_DELETE, ({ offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
