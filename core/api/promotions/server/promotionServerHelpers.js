import UserService from '../../users/server/UserService';
import { PROMOTION_INVITED_BY } from '../promotionConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';

const ANONYMIZED_STRING = 'XXX';
const ANONYMIZED_USER = {
  name: ANONYMIZED_STRING,
  phoneNumbers: [ANONYMIZED_STRING],
  email: ANONYMIZED_STRING,
};

const getUserPromotionPermissions = ({ userId, promotionId }) => {
  const { promotions = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    promotions: { _id: 1 },
  });

  const {
    $metadata: { permissions = {} },
  } = promotions.find(({ _id }) => _id === promotionId);

  return permissions;
};

const getCustomerInvitedBy = ({ customerId, promotionId }) => {
  const { loans = [] } = UserService.fetchOne({
    $filters: { _id: customerId },
    loans: { promotions: { _id: 1 } },
  });

  const {
    $metadata: { invitedBy },
  } = loans
    .reduce((promotions, loan) => [...promotions, ...loan.promotions], [])
    .find(({ _id }) => _id === promotionId);

  return invitedBy;
};

const getPromotionLotStatus = ({ promotionLotId }) => {
  const { status } = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    status: 1,
  }) || {};

  return status;
};

const getPromotionCustomerOwningGroup = ({
  customerId,
  promotionId,
  userId,
}) => {
  const invitedBy = getCustomerInvitedBy({ customerId, promotionId });

  // Is invited by nobody
  if (!invitedBy) {
    return null;
  }

  // Is invited by user
  if (invitedBy === userId) {
    return PROMOTION_INVITED_BY.USER;
  }

  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
  });

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

const shouldAnonymize = ({
  customerId,
  userId,
  promotionId,
  promotionLotId,
}) => {
  const customerOwningGroup = getPromotionCustomerOwningGroup({
    customerId,
    userId,
    promotionId,
  });
  const {
    canViewPromotion,
    canSeeCustomers,
    displayCustomerNames,
  } = getUserPromotionPermissions({ userId, promotionId });

  if (!canViewPromotion || !canSeeCustomers) {
    return true;
  }

  const promotionLotStatus = promotionLotId && getPromotionLotStatus({ promotionLotId });

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

export const handleLoansAnonymization = ({
  loans = [],
  userId,
  promotionId,
  promotionLotId,
}) =>
  loans.map((loan) => {
    const { user, ...rest } = loan;
    return {
      user: shouldAnonymize({
        customerId: user._id,
        userId,
        promotionId,
        promotionLotId,
      })
        ? ANONYMIZED_USER
        : user,
      ...rest,
    };
  });

export const handlePromotionLotsAnonymization = ({
  promotionLots = [],
  userId,
}) =>
  promotionLots.map((promotionLot) => {
    const { attributedTo, ...rest } = promotionLot;
    const [loan] = handleLoansAnonymization({
      loans: [attributedTo].filter(x => x),
      userId,
      promotionId: promotionLot.promotion._id,
      promotionLotId: promotionLot._id,
    });
    return {
      attributedTo: loan,
      ...rest,
    };
  });
