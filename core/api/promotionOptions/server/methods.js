import SecurityService from '../../security';
import PromotionOptionService from './PromotionOptionService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionOptionInsert,
  promotionOptionUpdate,
  promotionOptionRemove,
  increaseOptionPriority,
  reducePriorityOrder,
  promotionOptionUpdateObject,
  promotionOptionActivateReservation,
  promotionOptionUploadAgreement,
  promotionOptionAddToWaitList,
} from '../methodDefinitions';
import { Method } from '../../methods/methods';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.get(params.loanId);
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
  PromotionOptionService.update(params);
});

promotionOptionRemove.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  PromotionOptionService.remove(params);
});

increaseOptionPriority.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  PromotionOptionService.increasePriorityOrder(params);
});

reducePriorityOrder.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  PromotionOptionService.reducePriorityOrder(params);
});

promotionOptionUpdateObject.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  PromotionOptionService.updateStatusObject(params);
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
  SecurityService.checkIsServerCall(context);
  return PromotionOptionService.getExpiringSoonReservations();
});

export const generateHalfLifeReservationReminderTasks = new Method({
  name: 'generateHalfLifeReservationReminderTasks',
  params: {},
});

generateHalfLifeReservationReminderTasks.setHandler(context => {
  SecurityService.checkIsServerCall(context);
  return PromotionOptionService.getHalfLifeReservations();
});
