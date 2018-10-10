import PromotionLots from './promotionLots';

PromotionLots.addReducers({
  name: {
    body: { properties: { name: 1 } },
    reduce: ({ properties }) => properties[0].name,
  },
  value: {
    body: { properties: { value: 1 }, lots: { value: 1 } },
    reduce: ({ properties, lots }) =>
      properties.reduce((total, { value }) => total + value, 0)
      + lots.reduce((total, { value }) => total + value, 0),
  },
});
