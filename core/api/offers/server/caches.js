import OfferService from './OfferService';

OfferService.migrateCache(
  { cacheField: 'lenderCache' },
  // { lenderCache: { $exists: false } },
);
