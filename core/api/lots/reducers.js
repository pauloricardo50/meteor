import Lots from '.';
import { PROMOTION_LOT_STATUS } from '../promotionLots/promotionLotConstants';

Lots.addReducers({
  status: {
    body: {
      promotionLots: { status: 1, value: 1 },
    },
    reduce: ({ promotionLots }) =>
      (promotionLots && promotionLots[0] && promotionLots[0].status)
      || PROMOTION_LOT_STATUS.AVAILABLE,
  },
});
