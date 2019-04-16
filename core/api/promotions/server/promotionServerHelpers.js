import { array } from 'prop-types';
import { PROMOTION_LOT_STATUS } from 'core/api/promotionLots/promotionLotConstants';
import UserService from '../../users/server/UserService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwnerType as getCustomerOwnerType,
} from '../promotionClientHelpers';
import LoanService from '../../loans/server/LoanService';

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
  if (!promotionLotId) {
    return;
  }

  const { status } = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    status: 1,
  }) || {};

  return status;
};

/**
 * Out of all promotionLots attributed to this user, which one has
 * the most permissive status?
 *
 * @param {String} { loanId }
 * @returns {String} PROMOTION_LOT_STATUS
 */
export const getBestPromotionLotStatus = ({ loanId }) => {
  const { promotionOptions = [] } = LoanService.fetchOne({
    $filters: { _id: loanId },
    userId: 1,
    promotionOptions: {
      promotionLots: { status: 1, attributedToLink: 1 },
    },
  });

  const myPromotionLotStatuses = promotionOptions
    .reduce((arr, { promotionLots }) => [...arr, ...promotionLots], [])
    .filter(({ attributedToLink = {} }) => attributedToLink._id === loanId)
    .map(({ status }) => status);

  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.SOLD) >= 0) {
    return PROMOTION_LOT_STATUS.SOLD;
  }
  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.BOOKED) >= 0) {
    return PROMOTION_LOT_STATUS.BOOKED;
  }
  if (myPromotionLotStatuses.indexOf(PROMOTION_LOT_STATUS.AVAILABLE) >= 0) {
    return PROMOTION_LOT_STATUS.AVAILABLE;
  }
};

export const getPromotionCustomerOwnerType = ({
  customerId,
  promotionId,
  userId,
}) => {
  const invitedBy = getCustomerInvitedBy({ customerId, promotionId });
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
  });

  return getCustomerOwnerType({
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
  const customerOwnerType = getPromotionCustomerOwnerType({
    customerId,
    userId,
    promotionId,
  });
  const permissions = getUserPromotionPermissions({ userId, promotionId });

  const promotionLotStatus = getPromotionLotStatus({ promotionLotId });

  return clientShouldAnonymize({
    customerOwnerType,
    permissions,
    promotionLotStatus,
  });
};

export const makeLoanAnonymizer = ({
  userId,
  promotionId,
  promotionLotId,
  anonymize,
}) => {
  let permissions;
  let promotionLotStatus;

  if (anonymize === undefined) {
    permissions = getUserPromotionPermissions({ userId, promotionId });
    promotionLotStatus = getPromotionLotStatus({ promotionLotId, promotionId });
  }

  return (loan) => {
    const { _id: loanId, user = {}, ...rest } = loan;
    const { _id: customerId } = user;

    if (!promotionLotId) {
      promotionLotStatus = getBestPromotionLotStatus({ loanId });
    }

    const customerOwnerType = getPromotionCustomerOwnerType({
      customerId,
      promotionId,
      userId,
    });

    const anonymizeUser = anonymize === undefined
      ? clientShouldAnonymize({
        customerOwnerType,
        permissions,
        promotionLotStatus,
      })
      : anonymize;

    return {
      user: anonymizeUser ? ANONYMIZED_USER : user,
      ...rest,
    };
  };
};

export const makePromotionLotAnonymizer = ({ userId }) => (promotionLot) => {
  const { attributedTo, ...rest } = promotionLot;
  const {
    _id: promotionLotId,
    promotion: { _id: promotionId },
  } = promotionLot;
  const [loan] = [attributedTo]
    .filter(x => x)
    .map(makeLoanAnonymizer({ userId, promotionId, promotionLotId }));
  return { attributedTo: loan, ...rest };
};

export const makePromotionOptionAnonymizer = ({
  userId,
}) => (promotionOption) => {
  const { loan, custom, ...rest } = promotionOption;
  const {
    promotionLots,
    promotion: { _id: promotionId },
  } = promotionOption;
  const { _id: promotionLotId } = promotionLots[0];

  const anonymize = shouldAnonymize({
    customerId: loan.user._id,
    userId,
    promotionId,
    promotionLotId,
  });

  return {
    loan: makeLoanAnonymizer({
      userId,
      promotionId,
      promotionLotId,
      anonymize,
    })(loan),
    custom: anonymize ? ANONYMIZED_STRING : custom,
    ...rest,
  };
};
