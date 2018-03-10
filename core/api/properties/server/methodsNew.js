import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import PropertyService from '../PropertyService';
import {
  propertyInsert,
  propertyUpdate,
  propertyDelete,
} from '../methodDefinitions';

propertyInsert.setHandler((context, { object, userId }) => {
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

propertyUpdate.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return PropertyService.update({ propertyId, object });
});

propertyDelete.setHandler((context, { propertyId }) => {
  SecurityService.properties.isAllowedToDelete(propertyId);
  return PropertyService.remove({ propertyId });
});
