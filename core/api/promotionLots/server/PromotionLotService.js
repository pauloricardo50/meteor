import PromotionReservationService from '../../promotionReservations/server/PromotionReservationService';
import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import PromotionLots from '../promotionLots';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';

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

  bookPromotionLot({ promotionLotId, loanId, promotionReservation }) {
    const { promotionOptions = [] } = LoanService.fetchOne({
      $filters: { _id: loanId },
      promotionOptions: { promotionLots: { _id: 1 } },
    });

    const promotionOption = promotionOptions.find(({ promotionLots = [] }) =>
      promotionLots.some(({ _id }) => _id === promotionLotId));

    const promotionReservationId = PromotionReservationService.insert({
      promotionReservation,
      promotionOptionId: promotionOption._id,
    });

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.BOOKED },
    });

    this.addLink({
      id: promotionLotId,
      linkName: 'attributedTo',
      linkId: loanId,
    });

    return promotionReservationId;
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
