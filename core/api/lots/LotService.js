import Lots from './lots';
import CollectionService from '../helpers/CollectionService';
import PromotionLotService from '../promotionLots/PromotionLotService';

export class LotService extends CollectionService {
  constructor() {
    super(Lots);
  }

  update = ({ lotId, promotionLotId, ...rest }) => {
    const currentPromotionLotId = PromotionLotService.find({
      'lotLinks._id': lotId,
    });
    if (currentPromotionLotId !== promotionLotId) {
      if (currentPromotionLotId) {
        PromotionLotService.removeLotLink({
          promotionLotId: currentPromotionLotId,
          lotId,
        });
        if (promotionLotId) {
          PromotionLotService.addLotToPromotionLot({
            promotionLotId,
            lotId,
          });
        }
      }
    }
    return this._update({ id: lotId, ...rest });
  };
}

export default new LotService();
