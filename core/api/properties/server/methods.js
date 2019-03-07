import { Meteor } from 'meteor/meteor';
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
  inviteUserToProperty,
  addProUserToProperty,
  proPropertyInsert,
  setProPropertyPermissions,
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

inviteUserToProperty.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  SecurityService.properties.isAllowedToInviteCustomers({
    userId,
    propertyId: params.propertyId,
  });
  if (Meteor.microservice === 'pro') {
    return PropertyService.inviteUser({ ...params, proUserId: userId });
  }
  return PropertyService.inviteUser(params);
});

addProUserToProperty.setHandler(({ userId }, params) => {
  // TODO: security
  SecurityService.checkUserIsPro(userId);
  SecurityService.properties.isAllowedToInviteProUsers({
    userId,
    propertyId: params.propertyId,
  });
  return PropertyService.addProUser(params);
});

proPropertyInsert.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PropertyService.proPropertyInsert(params);
});

setProPropertyPermissions.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  SecurityService.properties.isAllowedToManagePermissions({
    userId,
    propertyId: params.propertyId,
  });
  PropertyService.setProUserPermissions(params);
});
