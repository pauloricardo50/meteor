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
} from '../methodDefinitions';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.get(params.loanId);
  SecurityService.checkOwnership(loan, userId);
  return PromotionOptionService.insert(params);
});

promotionOptionUpdate.setHandler(({ userId }, params) => {
  const { loan } = PromotionOptionService.fetchOne({
    $filters: { _id: params.promotionOptionId },
    loan: { _id: 1, userId: 1 },
  });
  SecurityService.checkOwnership(loan, userId);
  PromotionOptionService.update(params);
});

promotionOptionRemove.setHandler(({ userId }, params) => {
  const { loan } = PromotionOptionService.fetchOne({
    $filters: { _id: params.promotionOptionId },
    loan: { _id: 1, userId: 1 },
  });
  SecurityService.checkOwnership(loan, userId);
  PromotionOptionService.remove(params);
});

increaseOptionPriority.setHandler(({ userId }, params) => {
  const { loan } = PromotionOptionService.fetchOne({
    $filters: { _id: params.promotionOptionId },
    loan: { _id: 1, userId: 1 },
  });
  SecurityService.checkOwnership(loan, userId);
  PromotionOptionService.increasePriorityOrder(params);
});

reducePriorityOrder.setHandler(({ userId }, params) => {
  const { loan } = PromotionOptionService.fetchOne({
    $filters: { _id: params.promotionOptionId },
    loan: { _id: 1, userId: 1 },
  });
  SecurityService.checkOwnership(loan, userId);
  PromotionOptionService.reducePriorityOrder(params);
});

promotionOptionUpdateObject.setHandler(({ userId }, params) => {
  const { loan } = PromotionOptionService.fetchOne({
    $filters: { _id: params.promotionOptionId },
    loan: { _id: 1, userId: 1 },
  });
  SecurityService.checkOwnership(loan, userId);
  PromotionOptionService.updateStatusObject(params);
});
