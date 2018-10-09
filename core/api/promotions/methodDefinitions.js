import { Match } from 'meteor/check';
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
