import PromotionLots from './promotionLots';
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

  addLotToPromotionLot({ promotionLotId, lotId }) {
    return this.addLink({
      id: promotionLotId,
      linkName: 'lotLinks',
      linkId: lotId,
    });
  }

  removeLotLink({ promotionLotId, lotId }) {
    return this.removeLink({
      id: promotionLotId,
      linkName: 'lotLinks',
      linkId: lotId,
    });
  }
}

export default new PromotionLotService();
