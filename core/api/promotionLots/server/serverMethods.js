import { Method } from '../../methods/methods';

export const expirePromotionLotReservation = new Method({
  name: 'expirePromotionLotReservation',
  params: {
    promotionOptionId: String,
  },
});
