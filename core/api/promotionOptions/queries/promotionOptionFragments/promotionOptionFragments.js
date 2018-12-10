import { appPromotionLotFragment } from '../../../promotionLots/queries/promotionLotFragments';

export const fullPromotionOptionFragment = {
  createdAt: 1,
  updatedAt: 1,
  promotionLots: { name: 1, promotion: { name: 1 } },
  lots: { name: 1, type: 1, status: 1, description: 1 },
  loan: { name: 1 },
  priority: 1,
  custom: 1,
  solvency: 1,
};

export const proPromotionOptionFragment = {
  createdAt: 1,
  updatedAt: 1,
  loan: {
    solvency: 1,
    user: { phoneNumbers: 1, name: 1, email: 1 },
    promotions: { _id: 1 },
    promotionOptions: {
      name: 1,
      promotionLots: {
        _id: 1,
        attributedTo: { user: { _id: 1 } },
      },
      solvency: 1,
    },
    promotionProgress: 1,
  },
  lots: { name: 1, type: 1, description: 1 },
  priority: 1,
  custom: 1,
  solvency: 1,
};

export const appPromotionOptionFragment = {
  createdAt: 1,
  updatedAt: 1,
  custom: 1,
  lots: {
    name: 1,
    type: 1,
    description: 1,
    value: 1,
  },
  promotionLots: appPromotionLotFragment,
  priority: 1,
  attributedToMe: 1,
  solvency: 1,
};
