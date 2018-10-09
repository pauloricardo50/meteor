import PromotionLots from './promotionLots';

PromotionLots.addReducers({
  name: {
    body: { properties: { name: 1 } },
    reduce: ({ properties }) => properties[0].name,
  },
});
