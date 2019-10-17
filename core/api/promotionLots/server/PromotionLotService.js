import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import CollectionService from '../../helpers/CollectionService';
import PromotionLots from '../promotionLots';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';
import { PROMOTION_OPTION_STATUS } from 'core/api/promotionOptions/promotionOptionConstants';

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

  bookPromotionLot({ promotionOptionId, startDate, agreementFileKeys }) {
    const {
      loan: { _id: loanId } = {},
      promotionLots,
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    return PromotionOptionService.activateReservation({
      promotionOptionId,
      startDate,
      agreementFileKeys,
    })
      .then(() => {
        this.update({
          promotionLotId,
          object: { status: PROMOTION_LOT_STATUS.PRE_BOOKED },
        });
        this.addLink({
          id: promotionLotId,
          linkName: 'attributedTo',
          linkId: loanId,
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  cancelPromotionLotBooking({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
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

    return PromotionOptionService.cancelReservation({
      promotionOptionId,
    });
  }

  completePromotionLotBooking({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.BOOKED },
    });

    return PromotionOptionService.completeReservation({
      promotionOptionId,
    });
  }

  sellPromotionLot({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.SOLD },
    });

    return PromotionOptionService.sellLot({
      promotionOptionId,
    });
  }

  expirePromotionLotBooking({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
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

    return PromotionOptionService.expireReservation({
      promotionOptionId,
    });
  }
}

export default new PromotionLotService();
