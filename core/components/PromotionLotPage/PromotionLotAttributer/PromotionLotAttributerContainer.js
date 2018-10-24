import { compose, withProps, withState } from 'recompose';

import {
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from 'core/api';
import ClientEventService from 'core/api/events/ClientEventService';
import {
  PROMOTION_OPTION_QUERIES,
  PROMOTION_LOT_QUERIES,
} from 'core/api/constants';

export default compose(
  withState('isLoading', 'setLoading', false),
  withProps(({ promotionLotId, loanId }) => {
    const refresh = () => {
      ClientEventService.emit(PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS);
      ClientEventService.emit(PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT);
    };
    return {
      bookPromotionLot: () =>
        bookPromotionLot.run({ promotionLotId, loanId }).then(refresh),
      cancelPromotionLotBooking: () =>
        cancelPromotionLotBooking.run({ promotionLotId }).then(refresh),
      sellPromotionLot: () =>
        sellPromotionLot.run({ promotionLotId }).then(refresh),
    };
  }),
);
