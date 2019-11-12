import SecurityService from 'core/api/security';
import UserService from '../../users/server/UserService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwnerType as getCustomerOwnerType,
  clientGetBestPromotionLotStatus,
} from '../promotionClientHelpers';
import LoanService from '../../loans/server/LoanService';
import { ANONYMIZED_STRING } from '../../security/constants';

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

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  if (!promotion) {
    return {};
  }

  const {
    $metadata: { permissions = {} },
  } = promotion;

  return permissions;
};

const getCustomerInvitedBy = ({ customerId, promotionId }) => {
  const { loans = [] } =
    UserService.fetchOne({
      $filters: { _id: customerId },
      loans: { promotions: { _id: 1 } },
    }) || {};

  const { $metadata } =
    loans
      .reduce((promotions, loan) => {
        const { promotions: loanPromotions = [] } = loan;
        return [...promotions, ...loanPromotions];
      }, [])
      .find(({ _id }) => _id === promotionId) || {};

  return $metadata && $metadata.invitedBy;
};

const getPromotionLotStatus = ({ promotionLotId }) => {
  if (!promotionLotId) {
    return {};
  }

  const { status, attributedToLink = {} } =
    PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      status: 1,
      attributedToLink: 1,
    }) || {};

  return { status, attributedTo: attributedToLink._id };
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

  return clientGetBestPromotionLotStatus(promotionOptions, loanId);
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

export const shouldAnonymize = ({
  customerId,
  userId,
  promotionId,
  promotionLotId,
  loanId,
}) => {
  const customerOwnerType = getPromotionCustomerOwnerType({
    customerId,
    userId,
    promotionId,
  });
  const permissions = getUserPromotionPermissions({ userId, promotionId });

  const { status: promotionLotStatus, attributedTo } = getPromotionLotStatus({
    promotionLotId,
  });

  return clientShouldAnonymize({
    customerOwnerType,
    permissions,
    promotionLotStatus,
    isAttributed: attributedTo === loanId,
  });
};

export const promotionShouldAnonymize = shouldAnonymize;

export const makeLoanAnonymizer = ({
  userId,
  promotionId,
  promotionLotId,
  anonymize,
}) => {
  let permissions;
  let promotionLotStatus;
  let attributedTo;

  if (anonymize === undefined) {
    permissions = getUserPromotionPermissions({ userId, promotionId });
    const { status, attributedTo: attr } = getPromotionLotStatus({
      promotionLotId,
      promotionId,
    });
    promotionLotStatus = status;
    attributedTo = attr;
  }

  return loan => {
    const { _id: loanId, user = {}, ...rest } = loan;
    const { _id: customerId } = user;

    let isAttributed = loanId === attributedTo;

    if (!promotionLotId) {
      // If no promotionLot is passed here, we get the best one from the loan
      // For statuses RESERVED and SOLD, we check that it is attributed to
      // this loan
      promotionLotStatus = getBestPromotionLotStatus({ loanId });
      isAttributed = true;
    }

    const customerOwnerType = getPromotionCustomerOwnerType({
      customerId,
      promotionId,
      userId,
    });

    const anonymizeUser =
      anonymize === undefined
        ? clientShouldAnonymize({
            customerOwnerType,
            permissions,
            promotionLotStatus,
            isAttributed,
          })
        : anonymize;

    return {
      user: anonymizeUser ? { _id: user._id, ...ANONYMIZED_USER } : user,
      _id: loanId,
      isAnonymized: !!anonymizeUser,
      ...rest,
    };
  };
};

export const makePromotionLotAnonymizer = ({ userId }) => promotionLot => {
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
}) => promotionOption => {
  const { loan, adminNote, ...rest } = promotionOption;
  const {
    promotionLots,
    promotion: { _id: promotionId },
  } = promotionOption;
  const [{ _id: promotionLotId }] = promotionLots;

  const anonymize = shouldAnonymize({
    customerId: loan.user._id,
    userId,
    promotionId,
    promotionLotId,
    loanId: loan._id,
  });

  return {
    loan: makeLoanAnonymizer({
      userId,
      promotionId,
      promotionLotId,
      anonymize,
    })(loan),
    isAnonymized: !!anonymize,
    adminNote: anonymize
      ? { date: undefined, note: ANONYMIZED_STRING, isAnonymized: true }
      : adminNote,
    ...rest,
  };
};
