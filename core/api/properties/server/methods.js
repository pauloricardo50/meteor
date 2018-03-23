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
  const userIdIsDefined = !!userId;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  }

  return PropertyService.insert({
    property,
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

pushPropertyValue.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return LoanService.pushValue(object);
});

popPropertyValue.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return LoanService.pushValue(object);
});
