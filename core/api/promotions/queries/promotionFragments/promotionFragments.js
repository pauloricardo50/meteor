import { propertyPromotionFragment } from '../../../properties/queries/propertyFragments';

export const basePromotionFragment = {
  name: 1,
  type: 1,
  status: 1,
  address: 1,
  address1: 1,
  zipCode: 1,
  city: 1,
  properties: propertyPromotionFragment,
  lots: {
    value: 1,
    name: 1,
    type: 1,
    description: 1,
    promotionLots: { name: 1 },
    status: 1,
  },
  promotionLots: {
    _id: 1,
    status: 1,
    reducedStatus: 1,
    lots: { name: 1 },
    promotionOptions: { _id: 1 },
    name: 1,
  },
  users: { _id: 1, name: 1, email: 1, roles: 1 },
  loans: { _id: 1 },
  soldPromotionLots: 1,
  bookedPromotionLots: 1,
  availablePromotionLots: 1,
  contacts: 1,
};

export const proPromotionFragment = {
  ...basePromotionFragment,
  promotionLots: {
    _id: 1,
    value: 1,
    status: 1,
    reducedStatus: 1,
    lots: { name: 1, value: 1, type: 1, description: 1, status: 1 },
    properties: propertyPromotionFragment,
    promotionOptions: { _id: 1 },
    name: 1,
    attributedTo: { user: { name: 1 } },
  },
};

export const proPromotionsFragment = {
  ...basePromotionFragment,
};

export const adminPromotionsFragment = {
  ...proPromotionFragment,
};

export const searchPromotionsFragment = {
  name: 1,
  promotionLotLinks: 1,
};
