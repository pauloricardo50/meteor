import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import PropertyService from '../PropertyService';
import {
  propertyInsert,
  propertyUpdate,
  propertyDelete,
  pushPropertyValue,
  popPropertyValue,
} from '../methodDefinitions';

propertyInsert.setHandler((context, { property, userId }) => {
  let finalUserId;

  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
    finalUserId = userId;
  } else if (userId === undefined) {
    SecurityService.checkLoggedIn();
    finalUserId = Meteor.userId();
  } else if (userId === null) {
    SecurityService.checkLoggedOut();
    finalUserId = null;
  }

  return PropertyService.insert({ property, userId: finalUserId });
});

propertyUpdate.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return PropertyService.update({ propertyId, object });
});

propertyDelete.setHandler((context, { propertyId }) => {
  SecurityService.properties.isAllowedToDelete(propertyId);
  return PropertyService.remove({ propertyId });
});

pushPropertyValue.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return LoanService.pushValue(object);
});

popPropertyValue.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return LoanService.pushValue(object);
});
