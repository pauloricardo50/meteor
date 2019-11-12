import { cancelPromotionLotReservation } from 'core/api/methods/index';
import ServerEventService from '../../events/server/ServerEventService';
import PromotionService from './PromotionService';

import { removeLoanFromPromotion } from '../methodDefinitions';

ServerEventService.addBeforeMethodListener(
  removeLoanFromPromotion,
  ({ context, params }) => {
    context.unblock();
    const { loanId, promotionId } = params;

    const { promotionLots = [] } = PromotionService.fetchOne({
      $filters: { _id: promotionId },
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
