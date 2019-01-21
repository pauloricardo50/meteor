import { Meteor } from 'meteor/meteor';
import PromotionOptions from '.';

PromotionOptions.addReducers({
  promotion: {
    body: {
      promotionLots: {
        promotion: {
          name: 1,
          address1: 1,
          address2: 1,
          zipCode: 1,
          canton: 1,
          city: 1,
        },
      },
    },
    reduce: ({ promotionLots = [] }) =>
      (promotionLots.length > 0 ? promotionLots[0].promotion : {}),
  },
  name: {
    body: { promotionLots: { name: 1 } },
    reduce: ({ promotionLots = [] }) =>
      (promotionLots.length > 0 ? promotionLots[0].name : ''),
  },
  value: {
    body: { promotionLots: { value: 1 } },
    reduce: ({ promotionLots = [] }) =>
      (promotionLots.length > 0 ? promotionLots[0].value : 0),
  },
  priority: {
    body: { loan: { promotionLinks: 1 } },
    reduce: ({ loan, _id: promotionOptionId }) => {
      const { promotionLinks } = loan;
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
  canton: {
    body: { promotionLots: { promotion: { canton: 1 } } },
    reduce: ({ promotionLots = [] }) =>
      (promotionLots.length > 0 ? promotionLots[0].promotion.canton : undefined),
  },
});
