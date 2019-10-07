import { Method } from '../methods/methods';

export const promotionReservationInsert = new Method({
  name: 'promotionReservationInsert',
  params: { promotionReservation: Object, promotionOptionId: String },
});

export const promotionReservationRemove = new Method({
  name: 'promotionReservationRemove',
  params: { promotionReservationId: String },
});

export const promotionReservationUpdate = new Method({
  name: 'promotionReservationUpdate',
  params: { promotionReservationId: String, object: Object },
});
