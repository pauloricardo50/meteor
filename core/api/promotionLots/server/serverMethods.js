import { Method } from '../../methods/methods';

export const expirePromotionLotBooking = new Method({
  name: 'expirePromotionLotBooking',
  params: {
    promotionOptionId: String,
  },
});
