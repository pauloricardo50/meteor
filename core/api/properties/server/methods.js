import SecurityService from '../../security';
import PropertyService from './PropertyService';
import {
  propertyInsert,
  propertyUpdate,
  propertyDelete,
  pushPropertyValue,
  popPropertyValue,
  pullPropertyValue,
  evaluateProperty,
  propertyDataIsInvalid,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';

propertyInsert.setHandler((context, { property, userId, loanId }) => {
  userId = checkInsertUserId(userId);
  return PropertyService.insert({ property, userId, loanId });
});

propertyUpdate.setHandler(({ userId }, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId, userId);
  return PropertyService.update({ propertyId, object });
});

propertyDelete.setHandler((context, { propertyId }) => {
  SecurityService.properties.isAllowedToDelete(propertyId);
  return PropertyService.remove({ propertyId });
});

pushPropertyValue.setHandler(({ userId }, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId, userId);
  return PropertyService.pushValue({ propertyId, object });
});

popPropertyValue.setHandler(({ userId }, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId, userId);
  return PropertyService.popValue({ propertyId, object });
});

pullPropertyValue.setHandler(({ userId }, { propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId, userId);
  return PropertyService.pullValue({ propertyId, object });
});

evaluateProperty.setHandler((context, { propertyId, loanResidenceType }) => {
  context.unblock();
  SecurityService.properties.isAllowedToUpdate(propertyId, context.userId);
  return PropertyService.evaluateProperty({ propertyId, loanResidenceType });
});

propertyDataIsInvalid.setHandler((context, { propertyId, loanResidenceType }) => {
  context.unblock();
  SecurityService.properties.isAllowedToUpdate(propertyId, context.userId);
  return PropertyService.propertyDataIsInvalid({
    propertyId,
    loanResidenceType,
  });
});
