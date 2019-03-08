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
  removeProFromProperty,
  removeCustomerFromProperty,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';
import { ROLES } from '../../users/userConstants';

propertyInsert.setHandler((context, params) => {
  const userId = checkInsertUserId(params.userId);
  return PropertyService.insert({ ...params, userId });
});

propertyUpdate.setHandler(({ userId }, params) => {
  SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  return PropertyService.update(params);
});

propertyDelete.setHandler((context, params) => {
  SecurityService.properties.isAllowedToDelete(params.propertyId, params.userId);
  return PropertyService.remove(params);

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

inviteUserToProperty.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  SecurityService.properties.isAllowedToInviteCustomers({
    userId,
    propertyId: params.propertyId,
  });
  if (SecurityService.currentUserHasRole(ROLES.PRO)) {
    return PropertyService.inviteUser({ ...params, proUserId: userId });
  }
  return PropertyService.inviteUser(params);
});

addProUserToProperty.setHandler(({ userId }, params) => {
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

removeProFromProperty.setHandler(({ userId }, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  PropertyService.removeProFromProperty(params);
});

removeCustomerFromProperty.setHandler(({ userId }, params) => {
  const { loanId, propertyId } = params;
  SecurityService.checkUserIsPro(userId);
  SecurityService.properties.isAllowedToRemoveCustomer({
    userId,
    propertyId,
    loanId,
  });
  PropertyService.removeCustomerFromProperty(params);
});
