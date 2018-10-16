import Lots from './lots';
import CollectionService from '../helpers/CollectionService';
import PromotionLotService from '../promotionLots/PromotionLotService';

export class LotService extends CollectionService {
  constructor() {
    super(Lots);
  }

  update = ({ lotId, object: { promotionLotId, ...rest } }) => {
    const currentPromotionLot = PromotionLotService.findOne({
      'lotLinks._id': lotId,
    });

    const currentPromotionLotId = currentPromotionLot
      ? currentPromotionLot._id
      : null;

    if (currentPromotionLotId !== promotionLotId) {
      if (currentPromotionLotId !== null && promotionLotId !== undefined) {
        PromotionLotService.removeLotLink({
          promotionLotId: currentPromotionLotId,
          lotId,
        });
      }

      if (promotionLotId) {
        PromotionLotService.addLotToPromotionLot({
          promotionLotId,
          lotId,
        });
      }
    }
    return this._update({ id: lotId, object: rest });
  };

  removeLot = (lotId) => {
    const promotionLot = PromotionLotService.findOne({
      'lotLinks._id': lotId,
    });

    const promotionLotId = promotionLot ? promotionLot._id : null;

    if (promotionLotId) {
      PromotionLotService.removeLotLink({
        promotionLotId,
        lotId,
      });
    }

    return this.remove(lotId);
  };
}

export default new LotService();
