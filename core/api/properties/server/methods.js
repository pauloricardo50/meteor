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

propertyInsert.setHandler((context, params) => {
  const userId = checkInsertUserId(params.userId);
  return PropertyService.insert({ ...params, userId });
});

propertyUpdate.setHandler(({ userId }, params) => {
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.update(params);
});

propertyDelete.setHandler((context, params) => {
  SecurityService.properties.isAllowedToDelete(params.propertyId);
  return PropertyService.remove(params);
});

pushPropertyValue.setHandler(({ userId }, params) => {
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.pushValue(params);
});

popPropertyValue.setHandler(({ userId }, params) => {
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.popValue(params);
});

pullPropertyValue.setHandler(({ userId }, params) => {
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.pullValue(params);
});

evaluateProperty.setHandler(({ userId }, params) => {
  context.unblock();
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.evaluateProperty(params);
});

propertyDataIsInvalid.setHandler(({ userId }, params) => {
  context.unblock();
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.propertyDataIsInvalid(params);
});
