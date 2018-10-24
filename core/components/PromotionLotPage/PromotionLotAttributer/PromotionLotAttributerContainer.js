import { compose, withProps, withState } from 'recompose';

import {
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from 'core/api';

export default compose(
  withState('isLoading', 'setLoading', false),
  withProps(({ promotionLotId, loanId }) => ({
    bookPromotionLot: () => bookPromotionLot.run({ promotionLotId, loanId }),
    cancelPromotionLotBooking: () =>
      cancelPromotionLotBooking.run({ promotionLotId }),
    sellPromotionLot: () => sellPromotionLot.run({ promotionLotId }),
  })),
);
