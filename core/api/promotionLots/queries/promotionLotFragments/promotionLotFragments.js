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
    promotionLots: { name: 1 },
    users: { _id: 1 },
    lots: {
      name: 1,
      value: 1,
      type: 1,
      description: 1,
      promotionLots: { _id: 1 },
    },
  },
  name: 1,
  attributedTo: {
    user: { name: 1 },
  },
};

export const appPromotionLotFragment = {
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
  name: 1,
  attributedTo: {
    user: { _id: 1 },
  },
  promotion: { name: 1 },
};
