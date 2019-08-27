import { Meteor } from 'meteor/meteor';

import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import { fullPromotionOption } from '../../fragments';
import PromotionOptions from '../promotionOptions';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions);
  }

  get(promotionOptionId) {
    return this.collection
      .createQuery({
        $filters: { _id: promotionOptionId },
        ...fullPromotionOption(),
      })
      .fetchOne();
  }

  getPromotion(promotionOptionId) {
    const promotionOption = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { promotion: { _id: 1 } },
    });

    return (
      promotionOption.promotionLots
      && promotionOption.promotionLots[0].promotion
    );
  }

  remove({ promotionOptionId }) {
    const {
      loan: { _id: loanId },
    } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
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
    const { promotionOptions } = LoanService.fetchOne({
      $filters: { _id: loanId },
      promotionOptions: { _id: 1, promotionLots: { _id: 1 } },
    });

    const existingPromotionOption = promotionOptions
      && promotionOptions.find(({ promotionLots }) =>
        promotionLots
          && promotionLots.some(lot => lot._id === promotionLotId));

    if (existingPromotionOption) {
      throw new Meteor.Error('Vous avez déjà choisi ce lot. Essayez de rafraîchir la page.');
    }

    const promotionOptionId = super.insert({
      promotionLotLinks: [{ _id: promotionLotId }],
    });
    LoanService.addLink({
      id: loanId,
      linkName: 'promotionOptions',
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
    const { loan } = promotionOption;
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
