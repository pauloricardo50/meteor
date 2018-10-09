import PromotionLots from './promotionLots';
import PromotionService from '../promotions/PromotionService';

export class PromotionLotService {
  insert = ({ promotionLot = {}, promotionId }) => {
    const promotionLotId = PromotionLots.insert(promotionLot);
    PromotionService.update({
      promotionId,
      object: { promotionLotLinks: [{ _id: promotionLotId }] },
      operator: '$push',
    });
    return promotionLotId;
  };

  update = ({ promotionLotId, object, operator = '$set' }) =>
    PromotionLots.update(promotionLotId, { [operator]: object });
}

export default new PromotionLotService();
