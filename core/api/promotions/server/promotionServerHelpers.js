import moment from 'moment';

import { anonymizeLoan } from '../../loans/helpers';
import LoanService from '../../loans/server/LoanService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import { PROMOTION_OPTION_STATUS } from '../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { TASK_STATUS, TASK_TYPES } from '../../tasks/taskConstants';
import UserService from '../../users/server/UserService';
import {
  clientGetBestPromotionLotStatus,
  shouldAnonymize as clientShouldAnonymize,
  getPromotionCustomerOwnerType as getCustomerOwnerType,
} from '../promotionClientHelpers';
import { PROMOTION_STATUS } from '../promotionConstants';
import PromotionService from './PromotionService';

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

  return $metadata?.invitedBy;
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
        permissions = currentUserPromotion.$metadata?.permissions;
      }

      promotionLotStatus = promotionLot.status;
      attributedTo = promotionLot.attributedToLink?._id;
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
  promotionOptionId,
}) => {
  const currentUser = UserService.get(userId, {
    promotions: { _id: 1 },
    organisations: { userLinks: 1 },
  });
  const { promotions: currentUserPromotions = [] } = currentUser;

  if (!promotionId && promotionLotId) {
    const { promotion } = PromotionLotService.get(promotionLotId, {
      promotion: { _id: 1 },
    });
    promotionId = promotion._id;
  } else if (!promotionId && promotionOptionId) {
    const { promotion } = PromotionOptionService.get(promotionOptionId, {
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
      permissions = currentUserPromotion.$metadata?.permissions;
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

export const getStepGettingDisbursedSoon = ({
  constructionTimeline,
  promotionId,
  signingDate,
}) => {
  const today = moment().startOf('day').toDate();
  const in10Days = moment().add(10, 'days').startOf('day').toDate();

  const {
    startPercent,
    steps = [],
    endDate,
    endPercent,
  } = constructionTimeline;

  // Find which step is getting disbursed soon
  let step;
  if (
    startPercent > 0 &&
    signingDate.getTime() >= today.getTime() &&
    signingDate.getTime() <= in10Days.getTime()
  ) {
    step = {
      type: TASK_TYPES.PROMOTION_SIGNING_DATE_STEP_REMINDER,
      id: promotionId,
      date: signingDate,
      description: 'Signature',
    };
  } else if (
    endPercent > 0 &&
    endDate.getTime() >= today.getTime() &&
    endDate.getTime() <= in10Days.getTime()
  ) {
    step = {
      type: TASK_TYPES.PROMOTION_END_DATE_STEP_REMINDER,
      id: promotionId,
      date: endDate,
      description: 'Remise des clés',
    };
  } else {
    steps.some(({ startDate, id, description }) => {
      if (
        startDate.getTime() >= today.getTime() &&
        startDate.getTime() <= in10Days.getTime()
      ) {
        step = {
          type: TASK_TYPES.PROMOTION_STEP_REMINDER,
          id,
          date: startDate,
          description,
        };
        return true;
      }
      return false;
    });
  }

  return step;
};

export const getPromotionsGettingDisbursedSoon = () => {
  const today = moment().startOf('day').toDate();
  const in10Days = moment().add(10, 'days').startOf('day').toDate();

  const promotionFilters = {
    status: { $in: [PROMOTION_STATUS.FINISHED, PROMOTION_STATUS.OPEN] },
    isTest: { $ne: true },
    $or: [
      // Signing date step
      {
        signingDate: { $lte: in10Days, $gte: today },
        'constructionTimeline.startPercent': { $ne: 0, $exists: true },
      },
      // Handover of the keys step
      {
        'constructionTimeline.endDate': { $lte: in10Days, $gte: today },
        'constructionTimeline.endPercent': { $ne: 0, $exists: true },
      },
      // Inbetween step
      {
        'constructionTimeline.steps.startDate': { $lte: in10Days, $gte: today },
      },
    ],
  };

  // Fetch all promotions that have a step disbursed soon
  // We don't match steps that are exactly in 10 days only, in case the cron failed
  const promotions = PromotionService.fetch({
    $filters: promotionFilters,
    constructionTimeline: 1,
    promotionOptions: { status: 1, loanCache: 1 },
    signingDate: 1,
  });

  return promotions;
};

export const getLoansWithoutStepReminderTask = ({
  promotionOptions = [],
  step,
}) => {
  // Filter SOLD promotion options
  const loanIds = promotionOptions
    .filter(({ status }) => status === PROMOTION_OPTION_STATUS.SOLD)
    .map(({ loanCache }) => loanCache?.[0]?._id)
    .filter(x => x);

  if (!loanIds?.length) {
    return null;
  }

  // Get loans that don't already have this task
  const loanFilters = {
    _id: { $in: loanIds },
    tasksCache: {
      $not: {
        $elemMatch: {
          type: step.type,
          'metadata.stepId': step.id,
          'metadata.stepDate': step.date,
        },
      },
    },
  };

  const loans = LoanService.fetch({ $filters: loanFilters, _id: 1 });

  return loans;
};

export const getPromotionStepReminders = () => {
  const promotions = getPromotionsGettingDisbursedSoon();

  if (!promotions?.length) {
    return [];
  }

  const tasks = promotions
    .map(
      ({
        _id: promotionId,
        promotionOptions = [],
        constructionTimeline,
        signingDate,
      }) => {
        const step = getStepGettingDisbursedSoon({
          constructionTimeline,
          promotionId,
          signingDate,
        });

        if (!step) {
          return null;
        }

        const loans = getLoansWithoutStepReminderTask({
          promotionOptions,
          step,
        });

        if (!loans?.length) {
          return null;
        }

        return { step, loanIds: loans.map(({ _id }) => _id) };
      },
    )
    .filter(x => x);

  return tasks;
};
