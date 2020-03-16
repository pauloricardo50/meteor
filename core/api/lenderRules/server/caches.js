import LenderRulesService from './LenderRulesService';

LenderRulesService.migrateCache(
  { cacheField: 'organisationCache' },
  // { 'organisationCache._id': { $exists: false } },
);
