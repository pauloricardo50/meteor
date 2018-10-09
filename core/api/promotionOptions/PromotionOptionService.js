import PromotionOptions from './promotionOptions';
import LoanService from '../loans/LoanService';

export class PromotionOptionService {
  insert = ({ promotionOption, loanId }) => {
    const promotionOptionId = PromotionOptions.insert(promotionOption);
    LoanService.update({
      loanId,
      object: { promotionOptionLinks: [{ _id: promotionOptionId }] },
      operator: '$push',
    });
    return promotionOptionId;
  };

  update = ({ promotionOptionId, object, operator = '$set' }) =>
    PromotionOptions.update(promotionOptionId, { [operator]: object });
}

export default new PromotionOptionService();
