import { anonymizeLoan } from '../../loans/helpers';
import LoanService from '../../loans/server/LoanService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import UserService from '../../users/server/UserService';
import {
  clientGetBestPromotionLotStatus,
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwnerType as getCustomerOwnerType,
} from '../promotionClientHelpers';

const getUserPromotionPermissions = ({ userId, promotionId }) => {
  const { promotions = [] } = UserService.get(userId, {
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
    UserService.get(customerId, { loans: { promotions: { _id: 1 } } }) || {};

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
    PromotionLotService.get(promotionLotId, {
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
  const { promotionOptions = [] } = LoanService.get(loanId, {
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
  const { organisations = [] } = UserService.get(userId, {
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
    const { promotions = [], _id: loanId, promotionOptions = [] } = loan;
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

    return anonymizeLoan({ loan, shouldAnonymize: anonymizeUser });
  };
};

export const makePromotionLotAnonymizer = ({ currentUser }) => promotionLot => {
  const { attributedTo, ...rest } = promotionLot;

  const [loan] = [attributedTo]
    .filter(x => x)
    .map(makeLoanAnonymizer({ currentUser, promotionLot }));

  return { attributedTo: loan, ...rest };
};

export const makePromotionOptionAnonymizer = ({
  userId,
  promotionId,
  promotionLotId,
}) => {
  const currentUser = UserService.get(userId, {
    promotions: { _id: 1 },
    organisations: { userLinks: 1 },
  });
  const { promotions: currentUserPromotions = [] } = currentUser;

  if (!promotionId) {
    const { promotion } = PromotionLotService.get(promotionLotId, {
      promotion: { _id: 1 },
    });
    promotionId = promotion._id;
  }

  return promotionOption => {
    const { loan, promotionLots = [], invitedBy } = promotionOption;
    const [promotionLot] = promotionLots;
    const { status: promotionLotStatus, attributedTo } = promotionLot;

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
      isAttributed: attributedTo === loan?._id,
    });

    return {
      ...promotionOption,
      loan: anonymizeLoan({ loan, shouldAnonymize: anonymize }),
      isAnonymized: !!anonymize,
    };
  };
};
