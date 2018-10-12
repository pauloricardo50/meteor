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
        $filter: { _id: promotionOptionId },
        ...fullPromotionOptionFragment,
      })
      .fetchOne();
  }

  getPromotion(promotionOptionId) {
    const promotionOption = this.collection
      .createQuery({
        $filter: { _id: promotionOptionId },
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
    LoanService.collection.update(
      { _id: loanId, 'promotionLinks._id': promotionId },
      { $set: { 'promotionLinks.$.priorityOrder': newPriorityOrder } },
    );
    return super.remove(promotionOptionId);
  }

  insert = ({ promotionLotId, loanId }) => {
    const promotionOptionId = super.insert({
      promotionLotLinks: [{ _id: promotionLotId }],
      status: PROMOTION_OPTION_STATUS.TRIAL,
    });
    LoanService.update({
      loanId,
      object: { promotionOptionLinks: { _id: promotionOptionId } },
      operator: '$push',
    });
    const promotionId = this.getPromotion(promotionOptionId)._id;
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    });
    LoanService.collection.update(
      { _id: loanId, 'promotionLinks._id': promotionId },
      {
        $set: {
          'promotionLinks.$.priorityOrder': [
            ...priorityOrder,
            promotionOptionId,
          ],
        },
      },
    );
    return promotionOptionId;
  };

  update = ({ promotionOptionId, ...rest }) =>
    this._update({ id: promotionOptionId, ...rest });
}

export default new PromotionOptionService();
