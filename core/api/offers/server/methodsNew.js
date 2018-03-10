import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import OfferService from '../OfferService';
import { offerInsert, offerUpdate, offerDelete } from '../methodDefinitions';

offerInsert.setHandler((context, { offer, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.offers.isAllowedToInsert();
  }

  return OfferService.insert({
    offer,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

offerUpdate.setHandler((context, { offerId, offer }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, offer });
});

offerDelete.setHandler((context, { offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
