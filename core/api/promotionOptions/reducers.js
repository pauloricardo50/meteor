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
