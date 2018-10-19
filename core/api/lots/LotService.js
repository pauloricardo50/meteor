import Lots from './lots';
import CollectionService from '../helpers/CollectionService';
import PromotionLotService from '../promotionLots/PromotionLotService';
import { LOT_UPDATE_ERRORS, ERROR_CODES } from '../errors';
import { PROMOTION_LOT_STATUS } from '../promotionLots/promotionLotConstants';

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

    const currentPromotionLotStatus = currentPromotionLot
      ? currentPromotionLot.status
      : null;

    if (
      currentPromotionLotStatus
      && currentPromotionLotStatus !== PROMOTION_LOT_STATUS.AVAILABLE
    ) {
      throw new Meteor.Error(
        ERROR_CODES.FORBIDDEN,
        LOT_UPDATE_ERRORS.PROMOTION_LOT_BOOKED_OR_SOLD,
      );
    }

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
}

export default new LotService();
