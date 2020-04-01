import RevenueService from './RevenueService';

RevenueService.migrateCache(
  { cacheField: 'loanCache' },
  // { loanCache: { $exists: false } },
);

RevenueService.migrateCache(
  { cacheField: 'insuranceRequestCache' },
  // { insuranceRequestCache: { $exists: false } },
);
RevenueService.migrateCache(
  { cacheField: 'insuranceCache' },
  // { insuranceCache: { $exists: false } },
);
