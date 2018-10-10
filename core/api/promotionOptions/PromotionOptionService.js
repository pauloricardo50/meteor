import PromotionOptions from './promotionOptions';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions);
  }

  insert = ({ promotionOption, loanId }) => {
    const promotionOptionId = super.insert(promotionOption);
    LoanService.update({
      loanId,
      object: { promotionOptionLinks: { _id: promotionOptionId } },
      operator: '$push',
    });
    return promotionOptionId;
  };

  update = ({ promotionOptionId, ...rest }) =>
    super.update({ id: promotionOptionId, ...rest });
}

export default new PromotionOptionService();
