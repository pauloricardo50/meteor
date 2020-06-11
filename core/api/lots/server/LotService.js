import { Meteor } from 'meteor/meteor';

import { ERROR_CODES, LOT_ERRORS } from '../../errors';
import CollectionService from '../../helpers/server/CollectionService';
import { PROMOTION_LOT_STATUS } from '../../promotionLots/promotionLotConstants';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import Lots from '../lots';

export class LotService extends CollectionService {
  constructor() {
    super(Lots);
  }

  insert = ({ promotionLot: promotionLotId, ...lot }) => {
    const lotId = super.insert(lot);
    if (promotionLotId) {
      PromotionLotService.addLotToPromotionLot({ promotionLotId, lotId });
    }
    return lotId;
  };

  update = ({ lotId, object: { promotionLotId, ...rest } }) => {
    const currentPromotionLot = PromotionLotService.get(
      {
        'lotLinks._id': lotId,
      },
      { status: 1 },
    );

    const currentPromotionLotId = currentPromotionLot
      ? currentPromotionLot._id
      : null;

    const currentPromotionLotStatus = currentPromotionLot
      ? currentPromotionLot.status
      : null;

    if (
      currentPromotionLotStatus &&
      currentPromotionLotStatus !== PROMOTION_LOT_STATUS.AVAILABLE
    ) {
      throw new Meteor.Error(
        ERROR_CODES.FORBIDDEN,
        LOT_ERRORS.PROMOTION_LOT_RESERVED_OR_SOLD,
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
