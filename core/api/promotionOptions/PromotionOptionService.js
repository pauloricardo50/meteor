import PromotionOptions from './promotionOptions';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';
import { fullPromotionOptionFragment } from './queries/promotionOptionFragments';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions);
  }

  get(promotionOptionId) {
    return this.collection
      .createQuery({
        $filter: { _id: promotionOptionId },
        ...fullPromotionOptionFragment,
      })
      .fetchOne();
  }

  remove({ promotionOptionId }) {
    // TODO: Test me, this might not work at all
    const promotionOption = this.get(promotionOptionId);
    LoanService.update({
      loanId: promotionOption.loan._id,
      object: { 'promotionLinks.priorityOrder': { $eq: promotionOptionId } },
      operator: '$pull',
    });
    return super.remove(promotionOptionId);
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
