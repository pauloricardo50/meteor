import ServerEventService from '../../events/server/ServerEventService';
import LoanService from '../../loans/server/LoanService';
import { cancelPromotionLotReservation } from '../../promotionLots/methodDefinitions';
import { removeLoanFromPromotion } from '../methodDefinitions';

ServerEventService.addBeforeMethodListener(
  removeLoanFromPromotion,
  ({ context, params }) => {
    context.unblock();
    const { loanId } = params;
    const { promotionOptions = [] } = LoanService.get(loanId, {
      promotionOptions: { _id: 1 },
    });

    return Promise.all(
      promotionOptions.map(({ _id: promotionOptionId }) =>
        cancelPromotionLotReservation.run({ promotionOptionId }),
      ),
    );
  },
);
