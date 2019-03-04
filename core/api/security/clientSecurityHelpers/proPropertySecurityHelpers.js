import { hasMinimumRole } from './generalSecurityHelpers';
import { ROLES } from '../../users/userConstants';
import SecurityService from '../Security';
import { PROPERTY_STATUS } from '../../properties/propertyConstants';
import {
  getCurrentUserPermissionsForProProperty,
  shouldAnonymize,
} from '../../properties/propertyClientHelper';

const checkProPropertyPermissions = ({
  property,
  userId,
  permissions,
  propertyStatus = [],
}) => {
  if (propertyStatus.length && !propertyStatus.includes(property.status)) {
    return false;
  }

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  try {
    SecurityService.hasPermissionOnDoc({ doc: property, permissions, userId });
    return true;
  } catch (error) {
    return false;
  }
};

export const isAllowedToViewProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { userLinks = [], users = [], loans = [] } = property;
  const userLoans = loans
    .reduce((usersLoans, { user }) => [...usersLoans, user], [])
    .filter(x => x);

  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId)
    || userLoans.find(({ _id }) => _id === userId);

  if (!user) {
    return false;
  }

  return true;
};

export const isAllowedToInviteCustomersToProProperty = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canInviteCustomers: true };

  return checkProPropertyPermissions({
    property,
    userId,
    permissions,
    propertyStatus: [PROPERTY_STATUS.FOR_SALE, PROPERTY_STATUS.BOOKED],
  });
};

export const isAllowedToInviteProUsersToProProperty = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canInviteProUsers: true };

  return checkProPropertyPermissions({
    property,
    userId,
    permissions,
  });
};

export const isAllowedToManageProPropertyPermissions = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canManagePermissions: true };

  return checkProPropertyPermissions({
    property,
    userId,
    permissions,
  });
};

export const isAllowedToRemoveCustomerFromProProperty = ({
  property,
  currentUser,
  customerOwnerType,
}) => {
  const { _id: userId } = currentUser;
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }
  const { _id: propertyId } = property;
  const permissions = getCurrentUserPermissionsForProProperty({
    currentUser,
    propertyId,
  });

  return (
    isAllowedToInviteCustomersToProProperty({ property, currentUser })
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};

export const isAllowedToModifyProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = { canModifyProperty: true };

  return checkProPropertyPermissions({
    property,
    userId,
    permissions,
    propertyStatus: [PROPERTY_STATUS.FOR_SALE],
  });
};

export const isAllowedToSeeProPropertyCustomers = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { userLinks = [], users = [] } = property;

  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId);

  if (!user) {
    return false;
  }

  const userPermissions = user.permissions || user.$metadata.permissions;

  if (userPermissions.displayCustomerNames === false) {
    return false;
  }

  return true;
};

export const isAllowedToBookProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = { canBookLots: true };

  return checkProPropertyPermissions({ property, userId, permissions });
};

export const isAllowedToBookProPropertyToCustomer = ({
  property,
  currentUser,
  customerOwnerType,
}) => {
  const { _id: userId } = currentUser;
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { _id: propertyId } = property;
  const permissions = getCurrentUserPermissionsForProProperty({
    propertyId,
    currentUser,
  });

  return (
    isAllowedToBookProProperty({ property, currentUser })
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};

export const isAllowedToSellProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = {
    canSellLots: true,
  };

  return checkProPropertyPermissions({ property, userId, permissions });
};

export const isAllowedToSellProPropertyToCustomer = ({
  property,
  currentUser,
  customerOwnerType,
}) => {
  const { _id: userId } = currentUser;
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { _id: propertyId } = property;
  const permissions = getCurrentUserPermissionsForProProperty({
    propertyId,
    currentUser,
  });

  return (
    isAllowedToSellProProperty({ property, currentUser })
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};
