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
  requiredPermissions,
  propertyStatus = [],
}) => {
  if (propertyStatus.length && !propertyStatus.includes(property.status)) {
    return false;
  }
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  try {
    SecurityService.hasPermissionOnDoc({
      doc: property,
      requiredPermissions,
      userId,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const isUserLinkedToProperty = ({ userId, property }) => {
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

export const isAllowedToViewProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  return isUserLinkedToProperty({ userId, property });
};

export const isAllowedToInviteCustomersToProProperty = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canInviteCustomers: true };

  return checkProPropertyPermissions({
    property,
    userId,
    requiredPermissions,
    propertyStatus: [PROPERTY_STATUS.FOR_SALE, PROPERTY_STATUS.BOOKED],
  });
};

export const isAllowedToInviteProUsersToProProperty = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canInviteProUsers: true };

  return checkProPropertyPermissions({
    property,
    userId,
    requiredPermissions,
  });
};

export const isAllowedToManageProPropertyPermissions = ({
  property,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canManagePermissions: true };

  return checkProPropertyPermissions({
    property,
    userId,
    requiredPermissions,
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
  const requiredPermissions = { canModifyProperty: true };

  return checkProPropertyPermissions({
    property,
    userId,
    requiredPermissions,
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
  const requiredPermissions = { canBookLots: true };

  return checkProPropertyPermissions({ property, userId, requiredPermissions });
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
  const requiredPermissions = {
    canSellLots: true,
  };

  return checkProPropertyPermissions({ property, userId, requiredPermissions });
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
