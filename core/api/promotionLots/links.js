import PromotionLots from '.';

import { Promotions, Properties, Lots, PromotionOptions, Loans } from '..';

PromotionLots.addLinks({
  promotion: {
    collection: Promotions,
    inversedBy: 'promotionLots',
  },
  properties: {
    collection: Properties,
    field: 'propertyLinks',
    type: 'many',
    metadata: true,
  },
  lots: {
    collection: Lots,
    field: 'lotLinks',
    type: 'many',
    metadata: true,
  },
  promotionOptions: {
    collection: PromotionOptions,
    inversedBy: 'promotionLots',
    autoremove: true,
  },
  attributedTo: {
    collection: Loans,
    field: 'attributedToLink',
    type: 'one',
    metadata: true,
  },
});
