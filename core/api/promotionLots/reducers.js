import { Meteor } from 'meteor/meteor';
import {
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_REDUCED_STATUS,
} from 'core/api/constants';
import PromotionLots from './promotionLots';

PromotionLots.addReducers({
  name: {
    body: { properties: { name: 1 } },
    reduce: ({ properties }) =>
      properties && properties[0] && properties[0].name,
  },
  documents: {
    body: { properties: { documents: 1 } },
    reduce: ({ properties }) =>
      properties && properties[0] && properties[0].documents,
  },
  value: {
    body: { properties: { totalValue: 1 }, lots: { value: 1 } },
    reduce: ({ properties, lots }) => {
      // Sometimes, lots are undefined........ fuck me
      const propertiesValue = properties.reduce(
        (total, { totalValue }) => total + totalValue,
        0,
      );
      const lotsValue = lots
        ? lots.reduce((total, { value }) => total + value, 0)
        : 0;

      return propertiesValue + lotsValue;
    },
  },
  reducedStatus: {
    body: { status: 1, attributedTo: { user: { _id: 1 } } },
    reduce: ({ status, attributedTo }) => {
      if (
        attributedTo
        && attributedTo.user
        && attributedTo.user._id === Meteor.userId()
      ) {
        switch (status) {
        case PROMOTION_LOT_STATUS.BOOKED:
          return PROMOTION_LOT_REDUCED_STATUS.BOOKED_FOR_ME;
        case PROMOTION_LOT_STATUS.SOLD:
          return PROMOTION_LOT_REDUCED_STATUS.SOLD_TO_ME;
        default:
          return status;
        }
      }
      if (status === PROMOTION_LOT_STATUS.BOOKED) {
        return PROMOTION_LOT_REDUCED_STATUS.NOT_AVAILABLE;
      }
      return status;
    },
  },
});
