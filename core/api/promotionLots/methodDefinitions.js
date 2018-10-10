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

export const addLotToPromotionLot = new Method({
  name: 'addLotToPromotionLot',
  params: {
    promotionLotId: String,
    lotId: String,
  },
});

export const removeLotLink = new Method({
  name: 'removeLotLink',
  params: {
    promotionLotId: String,
    lotId: String,
  },
});
