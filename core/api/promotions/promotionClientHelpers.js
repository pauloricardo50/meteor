import { PROMOTION_INVITED_BY_TYPE } from './promotionConstants';

export const getCurrentUserPermissionsForPromotion = ({
  currentUser: { promotions = [] } = {},
  promotionId,
}) => {
  const promotion = promotions.find(({ _id }) => _id === promotionId);
  return promotion && promotion.$metadata.permissions;
};

export const getPromotionCustomerOwnerType = ({ invitedBy, currentUser }) => {
  const { _id: userId, organisations = [] } = currentUser;

  // Is invited by nobody
  if (!invitedBy) {
    return null;
  }

  // Is invited by user
  if (invitedBy === userId) {
    return PROMOTION_INVITED_BY_TYPE.USER;
  }

  const organisationUserIds = organisations.reduce(
    (userIds, org) => [...userIds, ...org.users.map(({ _id }) => _id)],
    [],
  );

  // Is invited by organisation
  if (organisationUserIds.includes(invitedBy)) {
    return PROMOTION_INVITED_BY_TYPE.ORGANISATION;
  }

  // Is invited by someone else
  return PROMOTION_INVITED_BY_TYPE.ANY;
};

export const shouldAnonymize = ({
  customerOwnerType,
  permissions,
  promotionLotStatus,
}) => {
  const { displayCustomerNames } = permissions;

  if (displayCustomerNames === false || !customerOwnerType) {
    return true;
  }

  const shouldHideForLotStatus =
    !!promotionLotStatus &&
    !displayCustomerNames.forLotStatus.includes(promotionLotStatus);

  if (displayCustomerNames.invitedBy === PROMOTION_INVITED_BY_TYPE.ANY) {
    return shouldHideForLotStatus;
  }

  switch (customerOwnerType) {
  case PROMOTION_INVITED_BY_TYPE.USER:
    return (
      shouldHideForLotStatus ||
        ![
          PROMOTION_INVITED_BY_TYPE.USER,
          PROMOTION_INVITED_BY_TYPE.ORGANISATION,
        ].includes(displayCustomerNames.invitedBy)
    );
  case PROMOTION_INVITED_BY_TYPE.ORGANISATION:
    return (
      shouldHideForLotStatus ||
        displayCustomerNames.invitedBy !==
          PROMOTION_INVITED_BY_TYPE.ORGANISATION
    );
  default:
    return true;
  }
};

export const getUserNameAndOrganisation = ({ user }) => {
  const { name, organisations = [] } = user;
  const organisationName = !!organisations.length && organisations[0].name;
  return organisationName ? `${name} (${organisationName})` : name;
};
