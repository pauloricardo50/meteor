import { Meteor } from 'meteor/meteor';

import { PROMOTION_RESERVATION_STATUS } from 'core/api/promotionReservations/promotionReservationConstants';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
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

    const promotionReservationId = PromotionReservationService.insert({
      promotionReservation,
      promotionOptionId,
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
    const { _id: promotionReservationId } = this.getActivePromotionReservation({
      promotionLotId,
    });

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

  getActivePromotionReservation({ promotionLotId }) {
    const { promotionReservations = [], status } = this.fetchOne({
      $filters: {
        _id: promotionLotId,
        'promotionReservations.status': {
          $in: [PROMOTION_RESERVATION_STATUS.ACTIVE],
        },
      },
      promotionReservations: { _id: 1 },
    });

    if (
      status !== PROMOTION_LOT_STATUS.BOOKED
      || !promotionReservations.length
    ) {
      throw new Meteor.Error("Ce lot n'est pas réservé");
    }

    const [activePromotionReservation] = promotionReservations;
    return activePromotionReservation;
  }

  sellPromotionLot({ promotionLotId }) {
    const { _id: promotionReservationId } = this.getActivePromotionReservation({
      promotionLotId,
    });
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
