import { PROMOTION_LOT_STATUS } from '../constants';
import addressReducer from '../reducers/addressReducer';
import Promotions from '.';

const promotionLotStatusReducer = status => ({
  body: {
    promotionLots: { status: 1 },
  },
  reduce: ({ promotionLots = [] }) =>
    promotionLots.filter(
      ({ status: promotionLotStatus }) => status === promotionLotStatus,
    ),
});

Promotions.addReducers({
  ...addressReducer,
  soldPromotionLots: promotionLotStatusReducer(PROMOTION_LOT_STATUS.SOLD),
  bookedPromotionLots: promotionLotStatusReducer(PROMOTION_LOT_STATUS.BOOKED),
  availablePromotionLots: promotionLotStatusReducer(
    PROMOTION_LOT_STATUS.AVAILABLE,
  ),
});
