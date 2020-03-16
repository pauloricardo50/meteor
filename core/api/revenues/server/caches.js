import RevenueService from './RevenueService';

RevenueService.migrateCache(
  { cacheField: 'loanCache' },
  // { loanCache: { $exists: false } },
);
