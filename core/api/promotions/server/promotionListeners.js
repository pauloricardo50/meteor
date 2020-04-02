import ServerEventService from '../../events/server/ServerEventService';
import { cancelPromotionLotReservation } from '../../promotionLots/methodDefinitions';
import { removeLoanFromPromotion } from '../methodDefinitions';
import PromotionService from './PromotionService';

ServerEventService.addBeforeMethodListener(
  removeLoanFromPromotion,
  ({ context, params }) => {
    context.unblock();
    const { loanId, promotionId } = params;

    const { promotionLots = [] } = PromotionService.get(promotionId, {
      promotionLots: { attributedTo: 1 },
    });

    return Promise.all(
      promotionLots
        .filter(({ attributedTo }) => attributedTo === loanId)
        .map(({ _id: promotionLotId }) =>
          // Also sets the status to AVAILABLE
          cancelPromotionLotReservation.run({ promotionLotId }),
        ),
    );
  },
);
