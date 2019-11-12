import SecurityService from '../../security';
import PromotionOptionService from './PromotionOptionService';
import LoanService from '../../loans/server/LoanService';
import {
  promotionOptionInsert,
  promotionOptionUpdate,
  promotionOptionRemove,
  increaseOptionPriority,
  reducePriorityOrder,
} from '../methodDefinitions';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.get(params.loanId);
  SecurityService.checkOwnership(loan);
  return PromotionOptionService.insert(params);
});

promotionOptionUpdate.setHandler(({ userId }, params) =>
  // TODO: Security check
  PromotionOptionService.update(params),
);

promotionOptionRemove.setHandler(({ userId }, params) =>
  // TODO: Security check

  PromotionOptionService.remove(params),
);

increaseOptionPriority.setHandler((context, params) =>
  PromotionOptionService.increasePriorityOrder(params),
);

reducePriorityOrder.setHandler((context, params) =>
  PromotionOptionService.reducePriorityOrder(params),
);
