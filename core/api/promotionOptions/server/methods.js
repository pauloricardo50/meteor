import SecurityService from '../../security';
import PromotionOptionService from '../PromotionOptionService';
import LoanService from '../../loans/LoanService';
import {
  promotionOptionInsert,
  promotionOptionUpdate,
  promotionOptionRemove,
} from '../methodDefinitions';

promotionOptionInsert.setHandler(({ userId }, params) => {
  const loan = LoanService.getLoanById(params.loanId);
  SecurityService.checkOwnership(loan);
  return PromotionOptionService.insert(params);
});

promotionOptionUpdate.setHandler(({ userId }, params) =>
  // TODO: Security check
  PromotionOptionService.update(params));

promotionOptionRemove.setHandler(({ userId }, params) =>
// TODO: Security check

  PromotionOptionService.remove(params));
