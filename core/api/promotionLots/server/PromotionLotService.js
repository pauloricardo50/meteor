import { Meteor } from 'meteor/meteor';

import Calculator from '../../../utils/Calculator';
import CollectionService from '../../helpers/server/CollectionService';
import { PROMOTION_OPTION_STATUS } from '../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';
import PromotionLots from '../promotionLots';

class PromotionLotService extends CollectionService {
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
    const promotionOption = PromotionOptionService.get(promotionOptionId, {
      loan: { _id: 1 },
      promotionLots: { _id: 1, status: 1 },
      bank: 1,
      simpleVerification: 1,
      fullVerification: 1,
      reservationAgreement: 1,
      reservationDeposit: 1,
    });
    const { loan: { _id: loanId } = {}, promotionLots } = promotionOption;

    const [{ _id: promotionLotId, status: promotionLotStatus }] = promotionLots;

    if (promotionLotStatus !== PROMOTION_LOT_STATUS.AVAILABLE) {
      throw new Meteor.Error(403, 'Ce lot est déjà réservé');
    }

    if (!Calculator.canConfirmPromotionLotReservation({ promotionOption })) {
      throw new Meteor.Error(
        403,
        "Cette réservation n'est pas encore complète",
      );
    }

    this.addLink({
      id: promotionLotId,
      linkName: 'attributedTo',
      linkId: loanId,
    });

    this.update({
      promotionLotId,
      object: { status: PROMOTION_LOT_STATUS.RESERVED },
    });

    return PromotionOptionService.completeReservation({
      promotionOptionId,
    });
  }

  cancelPromotionLotReservation({ promotionOptionId }) {
    const { promotionLots, status } = PromotionOptionService.get(
      promotionOptionId,
      {
        loan: { _id: 1 },
        promotionLots: { _id: 1 },
        status: 1,
      },
    );

    // Make promotion lot available again only if it was sold or reserved
    if (
      [PROMOTION_OPTION_STATUS.SOLD, PROMOTION_OPTION_STATUS.RESERVED].includes(
        status,
      )
    ) {
      const [{ _id: promotionLotId }] = promotionLots;

      this.update({
        promotionLotId,
        object: { status: PROMOTION_LOT_STATUS.AVAILABLE },
      });
      this.removeLink({
        id: promotionLotId,
        linkName: 'attributedTo',
      });
    }

    return PromotionOptionService.cancelReservation({
      promotionOptionId,
    });
  }

  sellPromotionLot({ promotionOptionId }) {
    const { promotionLots } = PromotionOptionService.get(promotionOptionId, {
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
}

export default new PromotionLotService();
