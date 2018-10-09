export const proPromotionFragment = {
  name: 1,
  type: 1,
  status: 1,
  address: 1,
  properties: { address: 1 },
  lots: { name: 1 },
  promotionLots: { _id: 1 },
  users: { name: 1 },
  loans: { _id: 1 },
  soldPromotionLots: 1,
  bookedPromotionLots: 1,
  availablePromotionLots: 1,
};

export const proPromotionsFragment = {
  ...proPromotionFragment,
};
