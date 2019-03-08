import { PROPERTY_REFERRED_BY_TYPE } from './propertyConstants';

export const getCurrentUserPermissionsForProProperty = ({
  currentUser: { properties = [] } = {},
  propertyId,
}) => {
  const property = properties.find(({ _id }) => _id === propertyId);
  return property && property.$metadata.permissions;
};

export const getProPropertyCustomerOwnerType = ({
  referredByUser = {},
  referredByOrganisation = {},
  currentUser = {},
}) => {
  const { _id: userId, organisations = [] } = currentUser;

  // Is referred by nobody
  if (!referredByUser) {
    return null;
  }

  // Is referred by user
  if (referredByUser._id === userId) {
    return PROPERTY_REFERRED_BY_TYPE.USER;
  }

  const organisationIds = organisations.map(({ _id }) => _id);
  const organisationUserIds = organisations.reduce(
    (userIds, { users = [] }) => [...userIds, ...users.map(({ _id }) => _id)],
    [],
  );

  // Is referred by organisation
  if (
    organisationIds.includes(referredByOrganisation._id)
    // User is not referred by organisation, but by a user in current user's organisations
    || organisationUserIds.includes(referredByUser._id)
  ) {
    return PROPERTY_REFERRED_BY_TYPE.ORGANISATION;
  }

  // Is referred by someone else
  return PROPERTY_REFERRED_BY_TYPE.ANY;
};

const hasNoPermissions = ({ permissions }) => !Object.keys(permissions).length;

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
  permissions = {},
  propertyStatus,
}) => {
  // Never anonymize if referred by user
  if (customerOwnerType === PROPERTY_REFERRED_BY_TYPE.USER) {
    return false;
  }

  if (hasNoPermissions({ permissions })) {
    return true;
  }

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
  case PROPERTY_REFERRED_BY_TYPE.ORGANISATION:
    return shouldAnonymizeWhenReferredByTypeOrganisation({
      shouldHideForPropertyStatus,
      referredBy: displayCustomerNames.referredBy,
    });
  default:
    return true;
  }
};
