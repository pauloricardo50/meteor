import { Meteor } from 'meteor/meteor';

import PromotionOptions from '.';

PromotionOptions.addReducers({
  name: {
    body: { promotionLots: { name: 1 } },
    reduce: ({ promotionLots = [] }) =>
      promotionLots.length > 0 ? promotionLots[0].name : '',
  },
  value: {
    body: { promotionLots: { value: 1 } },
    reduce: ({ promotionLots = [] }) => {
      if (promotionLots.length === 0) {
        return 0;
      }

      return promotionLots[0].value;
    },
  },
  priority: {
    body: { loan: { promotionLinks: 1 } },
    reduce: ({ loan, _id: promotionOptionId }) => {
      const { promotionLinks } = loan;
      if (promotionLinks && promotionLinks.length > 0) {
        return promotionLinks[0].priorityOrder.findIndex(
          id => id === promotionOptionId,
        );
      }
      return null;
    },
  },
  attributedToMe: {
    body: { promotionLots: { attributedTo: { userId: 1 } } },
    reduce: ({ promotionLots = [] }) =>
      !!(promotionLots[0]?.attributedTo?.userId === Meteor.userId()),
  },
  canton: {
    body: { promotionLots: { promotion: { canton: 1 } } },
    reduce: ({ promotionLots = [] }) =>
      promotionLots.length > 0 ? promotionLots[0].promotion.canton : undefined,
  },
});
