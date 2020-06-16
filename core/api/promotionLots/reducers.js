import { Meteor } from 'meteor/meteor';

import {
  PROMOTION_LOT_REDUCED_STATUS,
  PROMOTION_LOT_STATUS,
} from './promotionLotConstants';
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
        attributedTo &&
        attributedTo.user &&
        attributedTo.user._id === Meteor.userId()
      ) {
        // This lot is reserved for the user
        switch (status) {
          case PROMOTION_LOT_STATUS.RESERVED:
            return PROMOTION_LOT_REDUCED_STATUS.RESERVED_FOR_ME;
          case PROMOTION_LOT_STATUS.SOLD:
            return PROMOTION_LOT_REDUCED_STATUS.SOLD_TO_ME;
          default:
            return status;
        }
      }

      if (
        [PROMOTION_LOT_STATUS.SOLD, PROMOTION_LOT_STATUS.RESERVED].includes(
          status,
        )
      ) {
        return PROMOTION_LOT_REDUCED_STATUS.NOT_AVAILABLE;
      }

      return status;
    },
  },
  attributedToPromotionOption: {
    body: {
      attributedToLink: 1,
      promotionOptions: {
        loanCache: 1,
        loan: { userCache: 1 },
      },
    },
    reduce: ({ attributedToLink = {}, promotionOptions = [] }) => {
      const { _id: attributedToLoanId } = attributedToLink;

      if (attributedToLoanId) {
        const attributedToPromotionOption = promotionOptions.find(
          ({ loanCache }) => loanCache?.[0]?._id === attributedToLoanId,
        );

        return attributedToPromotionOption;
      }
    },
  },
});
