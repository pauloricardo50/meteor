import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import OfferService from '../OfferService';
import { offerInsert, offerUpdate, offerDelete } from '../methodDefinitions';

offerInsert.setHandler(({ object, userId }) => {
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

offerUpdate.setHandler(({ offerId, object }) => {
  SecurityService.offers.isAllowedToUpdate(offerId);
  return OfferService.update({ offerId, object });
});

offerDelete.setHandler(({ offerId }) => {
  SecurityService.offers.isAllowedToDelete(offerId);
  return OfferService.remove({ offerId });
});
