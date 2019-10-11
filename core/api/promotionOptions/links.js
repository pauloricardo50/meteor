import PromotionOptions from '.';

import { PromotionLots, Lots, Loans, PromotionReservations } from '..';
import LinkInitializer from '../links/LinkInitializer';

PromotionOptions.addLinks({
  promotionLots: {
    field: 'promotionLotLinks',
    collection: PromotionLots,
    type: 'many',
    metadata: true,
  },
  lots: {
    field: 'lotLinks',
    collection: Lots,
    type: 'many',
    metadata: true,
  },
});

LinkInitializer.inversedInit(() => {
  PromotionOptions.addLinks({
    loan: {
      collection: Loans,
      inversedBy: 'promotionOptions',
    },
    promotionReservation: {
      inversedBy: 'promotionOption',
      type: 'one',
      collection: PromotionReservations,
      autoremove: true,
    },
  });
});
