export const proPromotionLotFragment = {
  _id: 1,
  value: 1,
  status: 1,
  lots: {
    name: 1,
    value: 1,
    type: 1,
    description: 1,
  },
  properties: { name: 1, value: 1 },
  promotionOptions: { _id: 1 },
  promotion: {
    name: 1,
    lots: {
      name: 1,
      value: 1,
      type: 1,
      description: 1,
      promotionLots: { _id: 1 },
    },
  },
  name: 1,
};
