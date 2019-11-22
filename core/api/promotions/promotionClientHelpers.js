import { PROMOTION_INVITED_BY_TYPE } from './promotionConstants';
import { PROMOTION_LOT_STATUS } from '../promotionLots/promotionLotConstants';

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
    (userIds, { users = [] }) => [...userIds, ...users.map(({ _id }) => _id)],
    [],
  );

  // Is invited by organisation
  if (organisationUserIds.includes(invitedBy)) {
    return PROMOTION_INVITED_BY_TYPE.ORGANISATION;
  }

  // Is invited by someone else
  return PROMOTION_INVITED_BY_TYPE.ANY;
};

export const clientGetBestPromotionLotStatus = (promotionOptions, loanId) => {
  const myPromotionLotStatuses = promotionOptions
    .reduce((arr, { promotionLots }) => [...arr, ...promotionLots], [])
    .filter(({ attributedToLink = {} }) => attributedToLink._id === loanId)
    .map(({ status }) => status);

  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.SOLD) >= 0) {
    return PROMOTION_LOT_STATUS.SOLD;
  }
  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.RESERVED) >= 0) {
    return PROMOTION_LOT_STATUS.RESERVED;
  }
  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.AVAILABLE) >= 0) {
    return PROMOTION_LOT_STATUS.AVAILABLE;
  }

  // return undefined if no promotion lots are attributed to this user
};

const shouldHideForLotStatus = (
  { forLotStatus = [] } = {},
  promotionLotStatus,
  isAttributed,
) => {
  if (
    Object.values(PROMOTION_LOT_STATUS).every(status =>
      forLotStatus.includes(status),
    )
  ) {
    return false;
  }

  if (
    promotionLotStatus === PROMOTION_LOT_STATUS.AVAILABLE &&
    forLotStatus.includes(promotionLotStatus)
  ) {
    return false;
  }

  // For status RESERVED and SOLD, we check that it is attributed
  if (forLotStatus.includes(promotionLotStatus) && isAttributed) {
    return false;
  }

  return true;
};

export const shouldAnonymize = ({
  customerOwnerType,
  permissions,
  promotionLotStatus = PROMOTION_LOT_STATUS.AVAILABLE,
  isAttributed,
}) => {
  console.log('permissions:', permissions);
  if (!permissions || !Object.keys(permissions).length) {
    return true;
  }

  const { displayCustomerNames } = permissions;

  if (displayCustomerNames === false) {
    return true;
  }

  const shouldHide = shouldHideForLotStatus(
    displayCustomerNames,
    promotionLotStatus,
    isAttributed,
  );

  if (displayCustomerNames.invitedBy === PROMOTION_INVITED_BY_TYPE.ANY) {
    return shouldHide;
  }

  switch (customerOwnerType) {
    case PROMOTION_INVITED_BY_TYPE.USER:
      return (
        shouldHide ||
        ![
          PROMOTION_INVITED_BY_TYPE.USER,
          PROMOTION_INVITED_BY_TYPE.ORGANISATION,
        ].includes(displayCustomerNames.invitedBy)
      );
    case PROMOTION_INVITED_BY_TYPE.ORGANISATION:
      return (
        shouldHide ||
        displayCustomerNames.invitedBy !==
          PROMOTION_INVITED_BY_TYPE.ORGANISATION
      );
    default:
      return true;
  }
};
