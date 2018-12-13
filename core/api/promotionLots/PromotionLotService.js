import PromotionLots from './promotionLots';
import CollectionService from '../helpers/CollectionService';
import { PROMOTION_LOT_STATUS } from './promotionLotConstants';

export class PromotionLotService extends CollectionService {
  constructor() {
    super(PromotionLots);
  }

  update({ promotionLotId, ...rest }) {
    return this._update({ id: promotionLotId, ...rest });
  }

  addLotToPromotionLot({ promotionLotId, lotId }) {
    return this.addLink({
      id: promotionLotId,
      linkName: 'lots',
      linkId: lotId,
    });
  }

  removeLotLink({ promotionLotId, lotId }) {
    return this.removeLink({
      id: promotionLotId,
      linkName: 'lots',
      linkId: lotId,
    });
  }

  bookPromotionLot({ promotionLotId, loanId }) {
    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.BOOKED },
    });
    return this.addLink({
      id: promotionLotId,
      linkName: 'attributedTo',
      linkId: loanId,
      multi: false,
    });
  }

  cancelPromotionLotBooking({ promotionLotId }) {
    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.AVAILABLE },
    });
    return this.removeLink({
      id: promotionLotId,
      linkName: 'attributedTo',
    });
  }

  sellPromotionLot({ promotionLotId }) {
    return this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.SOLD },
    });
  }
}

export default new PromotionLotService();
