import SecurityService from '../../security';
import PromotionOptionService from '../PromotionOptionService';
import LoanService from '../../loans/LoanService';
import {
  promotionOptionInsert,
  promotionOptionUpdate,
} from '../methodDefinitions';

promotionOptionInsert.setHandler(({ userId }, { promotionOption, loanId }) => {
  const loan = LoanService.getLoanById(loanId);
  SecurityService.checkOwnership(loan);
  return PromotionOptionService.insert({ promotionOption, loanId });
});

promotionOptionUpdate.setHandler(({ userId }, { promotionOptionId, object }) =>
  // TODO: Security check
  PromotionOptionService.update({ promotionOptionId, object }));
