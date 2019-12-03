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
  currentUser,
  anonymize,
  promotionLot = {},
}) => {
  const { promotions: currentUserPromotions = [] } = currentUser;

  return loan => {
    const { promotions = [], _id: loanId, promotionOptions = [], user } = loan;
    const { _id: userId } = user || {};
    const [
      { _id: promotionId, $metadata: { invitedBy } = {} } = {},
    ] = promotions;

    const customerOwnerType = getCustomerOwnerType({
      invitedBy,
      currentUser,
    });

    let permissions;
    let promotionLotStatus;
    let attributedTo;

    if (anonymize === undefined) {
      const currentUserPromotion = currentUserPromotions.find(
        ({ _id }) => _id === promotionId,
      );

      if (currentUserPromotion) {
        permissions =
          currentUserPromotion.$metadata &&
          currentUserPromotion.$metadata.permissions;
      }

      promotionLotStatus = promotionLot.status;
      attributedTo =
        promotionLot.attributedToLink && promotionLot.attributedToLink._id;
    }

    let isAttributed = loanId === attributedTo;

    if (Object.keys(promotionLot).length) {
      isAttributed = true;
      promotionLotStatus = clientGetBestPromotionLotStatus(
        promotionOptions,
        loanId,
      );
    }

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
      ...loan,
      user: anonymizeUser ? { _id: userId, ...ANONYMIZED_USER } : user,
      isAnonymized: !!anonymizeUser,
    };
  };
};

export const makePromotionLotAnonymizer = ({ currentUser }) => promotionLot => {
  const { attributedTo, ...rest } = promotionLot;

  const [loan] = [attributedTo]
    .filter(x => x)
    .map(makeLoanAnonymizer({ currentUser, promotionLot }));

  return { attributedTo: loan, ...rest };
};

export const makePromotionOptionAnonymizer = ({ currentUser }) => {
  const { promotions: currentUserPromotions = [] } = currentUser;

  return promotionOption => {
    const { loan, custom, promotionLots = [] } = promotionOption;
    const [promotionLot] = promotionLots;
    const { status: promotionLotStatus, attributedTo } = promotionLot;
    const { promotions, _id: loanId } = loan;
    const [{ _id: promotionId, $metadata: { invitedBy } = {} }] = promotions;

    const customerOwnerType = getCustomerOwnerType({
      invitedBy,
      currentUser,
    });

    let permissions = {};
    const currentUserPromotion = currentUserPromotions.find(
      ({ _id }) => _id === promotionId,
    );

    if (currentUserPromotion) {
      permissions =
        currentUserPromotion.$metadata &&
        currentUserPromotion.$metadata.permissions;
    }

    const anonymize = clientShouldAnonymize({
      customerOwnerType,
      permissions,
      promotionLotStatus,
      isAttributed: attributedTo === loanId,
    });

    return {
      ...promotionOption,
      loan: makeLoanAnonymizer({
        currentUser,
        promotionLot,
        anonymize,
      })(loan),
      custom: anonymize ? ANONYMIZED_STRING : custom,
      isAnonymized: !!anonymize,
    };
  };
};
