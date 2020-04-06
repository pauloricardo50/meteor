import Organisations from '../../organisations';
import LenderRulesService from './LenderRulesService';

LenderRulesService.cache(
  {
    cacheField: 'organisationCache',
    collection: Organisations,
    type: 'one',
    fields: { _id: 1, name: 1 },
    referenceField: 'organisationLink._id',
  },
  // { 'organisationCache._id': { $exists: false } },
);
