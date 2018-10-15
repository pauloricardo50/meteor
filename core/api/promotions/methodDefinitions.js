import { Method } from '../methods/methods';

export const promotionInsert = new Method({
  name: 'promotionInsert',
  params: {
    promotion: Object,
  },
});

export const promotionUpdate = new Method({
  name: 'promotionUpdate',
  params: {
    promotionId: String,
    object: Object,
  },
});

export const promotionRemove = new Method({
  name: 'promotionRemove',
  params: {
    promotionId: String,
  },
});

export const insertPromotionProperty = new Method({
  name: 'insertPromotionProperty',
  params: {
    promotionId: String,
    property: Object,
  },
});

export const inviteUserToPromotion = new Method({
  name: 'inviteUserToPromotion',
  params: {
    promotionId: String,
    user: Object,
  },
});
