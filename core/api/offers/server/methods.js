import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import OfferService from '../OfferService';
import { offerInsert, offerUpdate, offerDelete } from '../methodDefinitions';

offerInsert.setHandler((context, { offer, loanId, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.offers.isAllowedToInsert();
  }

  return OfferService.insertAdminOffer({
    offer,
    loanId,
    userId: userIdIsDefined ? userId : Meteor.userId() || undefined,
  });
});

offerUpdate.setHandler((context, { offerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, object });
});

offerDelete.setHandler((context, { offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
