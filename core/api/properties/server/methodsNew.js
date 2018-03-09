import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import PropertyService from '../PropertyService';
import {
  propertyInsert,
  propertyUpdate,
  propertyDelete,
} from '../methodDefinitions';

propertyInsert.setHandler(({ object, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.properties.isAllowedToInsert();
  }

  return PropertyService.insert({
    object,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

propertyUpdate.setHandler(({ propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return PropertyService.update({ propertyId, object });
});

propertyDelete.setHandler(({ propertyId }) => {
  SecurityService.properties.isAllowedToDelete(propertyId);
  return PropertyService.remove({ propertyId });
});
