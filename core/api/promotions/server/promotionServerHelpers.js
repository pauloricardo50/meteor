import UserService from '../../users/server/UserService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwnerType as getCustomerOwnerType,
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
    promotionLotStatus = promotionLotId && getPromotionLotStatus({ promotionLotId });
  }

  return (loan) => {
    const { user = {}, ...rest } = loan;
    const { _id: customerId } = user;

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
