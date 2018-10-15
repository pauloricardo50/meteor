import PromotionOptions from './promotionOptions';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';
import { fullPromotionOptionFragment } from './queries/promotionOptionFragments';
import { PROMOTION_OPTION_STATUS } from './promotionOptionConstants';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions);
  }

  get(promotionOptionId) {
    return this.collection
      .createQuery({
        $filters: { _id: promotionOptionId },
        ...fullPromotionOptionFragment,
      })
      .fetchOne();
  }

  getPromotion(promotionOptionId) {
    const promotionOption = this.collection
      .createQuery({
        $filters: { _id: promotionOptionId },
        promotionLots: { promotion: { _id: 1 } },
      })
      .fetchOne();
    return (
      promotionOption.promotionLots
      && promotionOption.promotionLots[0].promotion[0]
    );
  }

  remove({ promotionOptionId }) {
    const promotionOption = this.get(promotionOptionId);
    const loan = promotionOption.loan[0];
    const loanId = loan._id;
    LoanService.removeLink({
      id: loanId,
      linkName: 'promotionOptionLinks',
      linkId: promotionOptionId,
    });
    const promotionId = this.getPromotion(promotionOptionId)._id;
    const newPriorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    }).filter(id => id !== promotionOptionId);
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: newPriorityOrder,
    });
    return super.remove(promotionOptionId);
  }

  insert = ({ promotionLotId, loanId }) => {
    const promotionOptionId = super.insert({
      promotionLotLinks: [{ _id: promotionLotId }],
      status: PROMOTION_OPTION_STATUS.TRIAL,
    });
    LoanService.addLink({
      id: loanId,
      linkName: 'promotionOptionLinks',
      linkId: promotionOptionId,
    });
    const promotionId = this.getPromotion(promotionOptionId)._id;
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    });
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: [...priorityOrder, promotionOptionId],
    });
    return promotionOptionId;
  };

  update = ({ promotionOptionId, ...rest }) =>
    this._update({ id: promotionOptionId, ...rest });

  changePriorityOrder({ promotionOptionId, change }) {
    const promotionOption = this.get(promotionOptionId);
    const loan = promotionOption.loan[0];
    const { _id: promotionId } = this.getPromotion(promotionOptionId);
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId: loan._id,
      promotionId,
    });
    const optionIndex = priorityOrder.indexOf(promotionOptionId);

    if (change < 0 && optionIndex === 0) {
      return false;
    }

    if (change > 0 && optionIndex === priorityOrder.length - 1) {
      return false;
    }

    const newPriorityOrder = priorityOrder.slice();
    newPriorityOrder[optionIndex] = priorityOrder[optionIndex + change];
    newPriorityOrder[optionIndex + change] = promotionOptionId;

    return LoanService.setPromotionPriorityOrder({
      loanId: loan._id,
      promotionId,
      priorityOrder: newPriorityOrder,
    });
  }

  increasePriorityOrder({ promotionOptionId }) {
    return this.changePriorityOrder({ promotionOptionId, change: -1 });
  }

  reducePriorityOrder({ promotionOptionId }) {
    return this.changePriorityOrder({ promotionOptionId, change: 1 });
  }
}

export default new PromotionOptionService();
