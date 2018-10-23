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
    // Don't request promotionLinks here: https://github.com/cult-of-coders/grapher/issues/301
    body: { loan: { promotionLinks: 1 } },
    reduce: ({ loan, _id: promotionOptionId }) => {
      const { promotionLinks } = (loan && loan[0]) || {};

      if (promotionLinks && promotionLinks.length > 0) {
        return promotionLinks[0].priorityOrder.findIndex(id => id === promotionOptionId);
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
