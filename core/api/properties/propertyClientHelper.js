import { PROPERTY_REFERRED_BY_TYPE } from './propertyConstants';

export const getCurrentUserPermissionsForProProperty = ({
  currentUser: { properties = [] } = {},
  propertyId,
}) => {
  const property = properties.find(({ _id }) => _id === propertyId);
  return property && property.$metadata.permissions;
};

export const getProPropertyCustomerOwnerType = ({
  referredByUser,
  referredByOrganisation,
  currentUser,
}) => {
  const { _id: userId, organisations = [] } = currentUser;

  // Is referred by nobody
  if (!referredByUser) {
    return null;
  }

  // Is referred by user
  if (referredByUser === userId) {
    return PROPERTY_REFERRED_BY_TYPE.USER;
  }

  const organisationIds = organisations.map(({ _id }) => _id);
  const organisationUserIds = organisations.reduce(
    (userIds, org) => [...userIds, ...org.users.map(({ _id }) => _id)],
    [],
  );

  // Is referred by organisation
  if (
    organisationIds.includes(referredByOrganisation)
    // User is not referred by organisation, but by a user in current user's organisations
    || organisationUserIds.includes(referredByUser)
  ) {
    return PROPERTY_REFERRED_BY_TYPE.ORGANISATION;
  }

  // Is referred by someone else
  return PROPERTY_REFERRED_BY_TYPE.ANY;
};

const shouldAnonymizeWhenReferredByTypeUser = ({
  shouldHideForPropertyStatus,
  referredBy,
}) =>
  shouldHideForPropertyStatus
  || ![
    PROPERTY_REFERRED_BY_TYPE.USER,
    PROPERTY_REFERRED_BY_TYPE.ORGANISATION,
  ].includes(referredBy);

const shouldAnonymizeWhenReferredByTypeOrganisation = ({
  shouldHideForPropertyStatus,
  referredBy,
}) =>
  shouldHideForPropertyStatus
  || referredBy !== PROPERTY_REFERRED_BY_TYPE.ORGANISATION;

export const shouldAnonymize = ({
  customerOwnerType,
  permissions,
  propertyStatus,
}) => {
  const { displayCustomerNames } = permissions;

  if (displayCustomerNames === false || !customerOwnerType) {
    return true;
  }

  const shouldHideForPropertyStatus = !!propertyStatus
    && !displayCustomerNames.forPropertyStatus.includes(propertyStatus);

  if (displayCustomerNames.referredBy === PROPERTY_REFERRED_BY_TYPE.ANY) {
    return shouldHideForPropertyStatus;
  }

  switch (customerOwnerType) {
  case PROPERTY_REFERRED_BY_TYPE.USER:
    return shouldAnonymizeWhenReferredByTypeUser({
      shouldHideForPropertyStatus,
      referredBy: displayCustomerNames.referredBy,
    });
  case PROPERTY_REFERRED_BY_TYPE.ORGANISATION:
    return shouldAnonymizeWhenReferredByTypeOrganisation({
      shouldHideForPropertyStatus,
      referredBy: displayCustomerNames.referredBy,
    });
  default:
    return true;
  }
};
