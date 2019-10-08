import PromotionReservations from '.';
import { Promotions, PromotionOptions, PromotionLots, Loans } from '..';

PromotionReservations.addLinks({
  promotion: {
    field: 'promotionLink',
    collection: Promotions,
    type: 'one',
    metadata: true,
  },
  promotionOption: {
    field: 'promotionOptionLink',
    collection: PromotionOptions,
    type: 'one',
    metadata: true,
    unique: true,
  },
  promotionLot: {
    field: 'promotionLotLink',
    collection: PromotionLots,
    type: 'one',
    metadata: true,
  },
  loan: {
    field: 'loanLink',
    collection: Loans,
    type: 'one',
    metadata: true,
  },
});
