import PromotionOptions from '.';

import { PromotionLots, Lots, Loans } from '..';

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
  loans: {
    collection: Loans,
    inversedBy: 'promotionOptions',
  },
});
