import { Meteor } from 'meteor/meteor';

import Calculator from '../../../utils/Calculator';
import { PROMOTION_OPTION_STATUS } from '../../constants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
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

  reservePromotionLot({ promotionOptionId }) {
    const {
      loan: { _id: loanId } = {},
      promotionLots,
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });

    const [{ _id: promotionLotId }] = promotionLots;

    return PromotionOptionService.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVED,
    })
      .then(() => {
        this.addLink({
          id: promotionLotId,
          linkName: 'attributedTo',
          linkId: loanId,
        });
      })
      .then(() =>
        this.update({
          promotionLotId,
          object: { status: PROMOTION_LOT_STATUS.RESERVED },
        }))
      .catch((error) => {
        throw error;
      });
  }

  cancelPromotionLotReservation({ promotionOptionId }) {
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

  completePromotionLotReservation({ promotionOptionId }) {
    const promotionOption = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotionLots: { _id: 1 },
    });
    const { promotionLots } = promotionOption;
    const [{ _id: promotionLotId }] = promotionLots;

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.RESERVED },
    });

    return PromotionOptionService.completeReservation({
      promotionOptionId,
    });
  }

  confirmPromotionLotReservation({ promotionOptionId }) {
    const promotionOption = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { _id: 1, status: 1 },
      bank: 1,
      deposit: 1,
      simpleVerification: 1,
      fullVerification: 1,
      reservationAgreement: 1,
    });
    const { promotionLots } = promotionOption;
    const [{ _id: promotionLotId, status }] = promotionLots;

    if (status !== PROMOTION_LOT_STATUS.AVAILABLE) {
      throw new Meteor.Error(403, 'Ce lot est déjà réservé');
    }

    if (!Calculator.canConfirmPromotionLotReservation({ promotionOption })) {
      throw new Meteor.Error(
        403,
        "Cette réservation n'est pas encore complète",
      );
    }

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.RESERVED },
    });

    return PromotionOptionService.completeReservation({
      promotionOptionId,
    });
  }

  sellPromotionLot({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
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

  expirePromotionLotReservation({ promotionOptionId }) {
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
