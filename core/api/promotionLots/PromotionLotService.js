import PromotionLots from './promotionLots';
import CollectionService from '../helpers/CollectionService';
import { PROMOTION_LOT_STATUS } from './promotionLotConstants';

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

  bookPromotionLot({ promotionLotId, loanId }) {
    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.BOOKED },
    });
    return this.addLink({
      id: promotionLotId,
      linkName: 'attributedToLink',
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
      linkName: 'attributedToLink',
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
