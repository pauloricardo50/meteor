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

export const promotionLotRemove = new Method({
  name: 'promotionLotRemove',
  params: {
    promotionLotId: String,
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

export const reservePromotionLot = new Method({
  name: 'reservePromotionLot',
  params: { promotionOptionId: String },
});

export const cancelPromotionLotReservation = new Method({
  name: 'cancelPromotionLotReservation',
  params: {
    promotionOptionId: String,
  },
});

export const sellPromotionLot = new Method({
  name: 'sellPromotionLot',
  params: {
    promotionOptionId: String,
  },
});
