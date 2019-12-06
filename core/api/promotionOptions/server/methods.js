import { PROMOTION_EMAILS } from 'core/api/email/server/promotionEmailHelpers';
import SecurityService from '../../security';
import PromotionOptionService from './PromotionOptionService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionOptionInsert,
  promotionOptionUpdate,
  promotionOptionRemove,
  increaseOptionPriority,
  reducePriorityOrder,
  setPromotionOptionProgress,
  promotionOptionActivateReservation,
  promotionOptionUploadAgreement,
  promotionOptionAddToWaitList,
  getPromotionOptionProgressEmails,
} from '../methodDefinitions';
import { Method } from '../../methods/methods';
import { expirePromotionOptionReservation } from './serverMethods';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.findOne(params.loanId);
  SecurityService.checkOwnership(loan, userId);
  return PromotionOptionService.insert(params);
});

const canUpdatePromotionOption = (_id, userId) => {
  if (!SecurityService.isUserAdmin(userId)) {
    try {
      const { loan } = PromotionOptionService.fetchOne({
        $filters: { _id },
        loan: { _id: 1, userId: 1 },
      });
      SecurityService.checkOwnership(loan, userId);
    } catch (error) {
      SecurityService.promotions.isAllowedToManagePromotionReservation({
        promotionOptionId: _id,
        userId,
      });
    }
  }
};

promotionOptionUpdate.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.update(params);
});

promotionOptionRemove.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.remove(params);
});

increaseOptionPriority.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.increasePriorityOrder(params);
});

reducePriorityOrder.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.reducePriorityOrder(params);
});

setPromotionOptionProgress.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.setProgress(params);
});

promotionOptionActivateReservation.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.activateReservation(params);
});

promotionOptionUploadAgreement.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionOptionService.uploadAgreement(params);
});

promotionOptionAddToWaitList.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionOptionService.addToWaitList(params);
});

export const generateExpiringSoonReservationTasks = new Method({
  name: 'generateExpiringSoonReservationTasks',
  params: {},
});

generateExpiringSoonReservationTasks.setHandler(context => {
  SecurityService.checkIsInternalCall(context);
  return PromotionOptionService.getExpiringSoonReservations();
});

export const generateTenDayExpirationReminderTasks = new Method({
  name: 'generateHalfLifeReservationReminderTasks',
  params: {},
});

generateTenDayExpirationReminderTasks.setHandler(context => {
  SecurityService.checkIsInternalCall(context);
  return PromotionOptionService.getHalfLifeReservations();
});

expirePromotionOptionReservation.setHandler((context, params) =>
  PromotionOptionService.expireReservation(params),
);

getPromotionOptionProgressEmails.setHandler(
  ({ userId }, { id, nextStatus }) => {
    SecurityService.checkUserIsAdmin(userId);

    return PROMOTION_EMAILS.filter(
      ({ method, shouldSend = () => true }) =>
        method.config.name === 'setPromotionOptionProgress' &&
        shouldSend({ params: { id }, result: { nextStatus } }),
    ).map(({ description }) => description);
  },
);
