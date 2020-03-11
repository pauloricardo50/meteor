import PromotionLotService from './PromotionLotService';

PromotionLotService.migrateCache(
  { cacheField: 'promotionCache' },
  // { promotionCache: { $exists: false } },
);
