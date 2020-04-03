import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Lots from '../lots/lots';
import PromotionOptions from '../promotionOptions';
import Promotions from '../promotions';
import Properties from '../properties';
import PromotionLots from '.';

const promotionCache = {
  _id: 1,
  name: 1,
};

PromotionLots.addLinks({
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
  attributedTo: {
    collection: Loans,
    field: 'attributedToLink',
    type: 'one',
    metadata: true,
  },
});

LinkInitializer.inversedInit(() => {
  PromotionLots.addLinks({
    promotion: {
      collection: Promotions,
      inversedBy: 'promotionLots',
      denormalize: {
        field: 'promotionCache',
        body: promotionCache,
      },
    },
    promotionOptions: {
      collection: PromotionOptions,
      inversedBy: 'promotionLots',
      autoremove: true,
    },
  });
});
