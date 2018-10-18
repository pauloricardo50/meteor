import Lots from '.';

Lots.addReducers({
  status: {
    body: {
      promotionLots: { status: 1, value: 1 },
    },
    reduce: ({ promotionLots }) => promotionLots && promotionLots[0].status,
  },
});
