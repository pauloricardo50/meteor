import { Method } from '../../methods/methods';

export const expirePromotionOptionReservation = new Method({
  name: 'expirePromotionOptionReservation',
  params: { promotionOptionId: String },
});
