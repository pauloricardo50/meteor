import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const promotionLotInsert = new Method({
  name: 'promotionLotInsert',
  params: {
    promotionLot: Object,
    promotionId: String,
  },
});

export const promotionLotUpdate = new Method({
  name: 'promotionLotUpdate',
  params: {
    promotionLotId: String,
    object: Object,
  },
});
