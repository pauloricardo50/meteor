import UserService from '../../users/server/UserService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwningGroup as clientGetPromotionCustomerOwningGroup,
} from '../promotionClientHelpers';

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
  }) || {};

  const { $metadata } = loans
    .reduce((promotions, loan) => {
      const { promotions: loanPromotions = [] } = loan;
      return [...promotions, ...loanPromotions];
    }, [])
    .find(({ _id }) => _id === promotionId) || {};

  return $metadata && $metadata.invitedBy;
};

const getPromotionLotStatus = ({ promotionLotId }) => {
  const { status } = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    status: 1,
  }) || {};

  return status;
};

export const getPromotionCustomerOwningGroup = ({
  customerId,
  promotionId,
  userId,
}) => {
  const invitedBy = getCustomerInvitedBy({ customerId, promotionId });
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
  });

  return clientGetPromotionCustomerOwningGroup({
    invitedBy,
    currentUser: { _id: userId, organisations },
  });
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
  const permissions = getUserPromotionPermissions({ userId, promotionId });

  const promotionLotStatus = promotionLotId && getPromotionLotStatus({ promotionLotId });

  return clientShouldAnonymize({
    customerOwningGroup,
    permissions,
    promotionLotStatus,
  });
};

export const handleLoansAnonymization = ({
  loans = [],
  userId,
  promotionId,
  promotionLotId,
}) =>
  loans.map((loan) => {
    const { user = {}, ...rest } = loan;
    const { _id: customerId } = user;
    return {
      user: shouldAnonymize({
        customerId,
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

export const handlePromotionOptionsAnonymization = ({
  promotionOptions = [],
  userId,
}) =>
  promotionOptions.map((promotionOption) => {
    const { loan, custom, ...rest } = promotionOption;
    const {
      promotionLots,
      promotion: { _id: promotionId },
    } = promotionOption;
    const { _id: promotionLotId } = promotionLots[0];
    return {
      loan: handleLoansAnonymization({
        loans: [loan],
        userId,
        promotionId,
        promotionLotId,
      })[0],
      custom: shouldAnonymize({
        customerId: loan.user._id,
        userId,
        promotionId,
        promotionLotId,
      })
        ? ANONYMIZED_STRING
        : custom,
      ...rest,
    };
  });
