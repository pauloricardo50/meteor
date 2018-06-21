import SecurityService from '../../security';
import PropertyService from '../PropertyService';
import {
  propertyInsert,
  propertyUpdate,
  propertyDelete,
  pushPropertyValue,
  popPropertyValue,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';

propertyInsert.setHandler((context, { property, userId }) => {
  userId = checkInsertUserId(userId);
  return PropertyService.insert({ property, userId });
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
  return PropertyService.pushValue(object);
});

popPropertyValue.setHandler((context, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return PropertyService.pushValue(object);
});
