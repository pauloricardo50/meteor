import { Meteor } from 'meteor/meteor';
import PromotionOptions from '.';

PromotionOptions.addReducers({
  promotion: {
    body: { promotionLots: { promotion: { name: 1 } } },
    reduce: ({ promotionLots = [] }) => promotionLots[0].promotion,
  },
  name: {
    body: { promotionLots: { name: 1 } },
    reduce: ({ promotionLots = [] }) => promotionLots[0].name,
  },
  priority: {
    body: { loan: { promotionLinks: 1 } },
    reduce: ({ loan, _id: promotionOptionId }) => {
      const { promotionLinks } = loan;

      if (promotionLinks && promotionLinks.length > 1) {
        return promotionLinks.$metadata.priorityOrder.findIndex(id => id === promotionOptionId);
      }

      return null;
    },
  },
  attributedToMe: {
    body: { promotionLots: { attributedTo: { userId: 1 } } },
    reduce: ({ promotionLots = [] }) =>
      !!(
        promotionLots[0]
        && promotionLots[0].attributedTo
        && promotionLots[0].attributedTo.userId === Meteor.userId()
      ),
  },
});
