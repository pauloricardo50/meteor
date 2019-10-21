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
  promotionOptionRequestReservation,
} from '../methodDefinitions';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.get(params.loanId);
  SecurityService.checkOwnership(loan, userId);
  return PromotionOptionService.insert(params);
});

const canUpdatePromotionOption = (_id, userId) => {
  if (!SecurityService.isUserAdmin(userId)) {
    const { loan } = PromotionOptionService.fetchOne({
      $filters: { _id },
      loan: { _id: 1, userId: 1 },
    });
    SecurityService.checkOwnership(loan, userId);
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

promotionOptionRequestReservation.setHandler(({ userId }, params) => {
  canUpdatePromotionOption(params.promotionOptionId, userId);
  return PromotionOptionService.requestReservation(params);
});
