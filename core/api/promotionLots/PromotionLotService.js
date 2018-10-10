import PromotionLots from './promotionLots';
import PromotionService from '../promotions/PromotionService';
import PropertyService from '../properties/PropertyService';
import CollectionService from '../helpers/CollectionService';

export class PromotionLotService extends CollectionService {
  constructor() {
    super(PromotionLots);
  }
  // insert = ({ promotionLot = {}, promotionId }) => {
  //   const promotionLotId = PromotionLots.insert(promotionLot);
  //   PromotionService.update({
  //     promotionId,
  //     object: { promotionLotLinks: [{ _id: promotionLotId }] },
  //     operator: '$push',
  //   });
  //   return promotionLotId;
  // };

  update({ promotionLotId, ...rest }) {
    return super.update({ id: promotionLotId, ...rest });
  }
}

export default new PromotionLotService();
