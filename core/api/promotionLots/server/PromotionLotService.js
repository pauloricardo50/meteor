import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
import PromotionReservationService from 'core/api/promotionReservations/server/PromotionReservationService';
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

  bookPromotionLot({ promotionOptionId, promotionReservation }) {
    const {
      loan: { _id: loanId } = {},
      promotionLots,
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    return PromotionReservationService.insert({
      promotionReservation,
      promotionOptionId,
    })
      .then((promotionReservationId) => {
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
      })
      .catch((error) => {
        throw error;
      });
  }

  cancelPromotionLotBooking({ promotionOptionId }) {
    const {
      promotionLots,
      promotionReservation: { _id: promotionReservationId },
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
      promotionReservation: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.AVAILABLE },
    });
    this.removeLink({
      id: promotionLotId,
      linkName: 'attributedTo',
    });

    return PromotionReservationService.cancelReservation({
      promotionReservationId,
    });
  }

  sellPromotionLot({ promotionOptionId }) {
    const {
      promotionLots,
      promotionReservation: { _id: promotionReservationId },
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
      promotionReservation: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.SOLD },
    });

    return PromotionReservationService.completeReservation({
      promotionReservationId,
    });
  }
}

export default new PromotionLotService();
