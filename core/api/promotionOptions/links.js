import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Lots from '../lots/lots';
import PromotionLots from '../promotionLots/index';
import Promotions from '../promotions/index';
import PromotionOptions from '.';

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
  promotion: {
    field: 'promotionLink',
    collection: Promotions,
    type: 'one',
    metadata: true,
  },
});

LinkInitializer.inversedInit(() => {
  PromotionOptions.addLinks({
    loan: {
      collection: Loans,
      inversedBy: 'promotionOptions',
    },
  });
});
