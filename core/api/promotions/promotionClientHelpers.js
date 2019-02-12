import { PROMOTION_INVITED_BY } from './promotionConstants';
import Security from '../security/Security';

export const getCurrentUserPermissionsForPromotion = ({
  currentUser = {},
  promotionId,
}) => {
  const { promotions = [] } = currentUser;
  const promotion = promotions.find(({ _id }) => _id === promotionId);
  return promotion && promotion.$metadata.permissions;
};

export const getPromotionCustomerOwningGroup = ({ invitedBy, currentUser }) => {
  const { _id: userId, organisations = [] } = currentUser;

  // Is invited by nobody
  if (!invitedBy) {
    return null;
  }

  // Is invited by user
  if (invitedBy === userId) {
    return PROMOTION_INVITED_BY.USER;
  }

  const organisationUserIds = organisations.reduce(
    (userIds, org) => [...userIds, ...org.users.map(({ _id }) => _id)],
    [],
  );

  // Is invited by organisation
  if (organisationUserIds.includes(invitedBy)) {
    return PROMOTION_INVITED_BY.ORGANISATION;
  }

  // Is invited by someone else
  return PROMOTION_INVITED_BY.ANY;
};

export const shouldAnonymize = ({
  customerOwningGroup,
  permissions,
  promotionLotStatus,
}) => {
  const {
    canViewPromotion,
    canSeeCustomers,
    displayCustomerNames,
  } = permissions;

  if (!canViewPromotion || !canSeeCustomers) {
    return true;
  }

  const shouldHideForLotStatus = !!promotionLotStatus
    && !displayCustomerNames.forLotStatus.includes(promotionLotStatus);

  switch (customerOwningGroup) {
  case PROMOTION_INVITED_BY.USER:
    return (
      shouldHideForLotStatus
        || ![
          PROMOTION_INVITED_BY.USER,
          PROMOTION_INVITED_BY.ORGANISATION,
        ].includes(displayCustomerNames.invitedBy)
    );
  case PROMOTION_INVITED_BY.ORGANISATION:
    return (
      shouldHideForLotStatus
        || displayCustomerNames.invitedBy !== PROMOTION_INVITED_BY.ORGANISATION
    );
  case PROMOTION_INVITED_BY.ANY:
    return (
      shouldHideForLotStatus
        || displayCustomerNames.invitedBy !== PROMOTION_INVITED_BY.ANY
    );
  default:
    return true;
  }
};
