import Loans from '../../loans';
import ChecklistService from './ChecklistService';

ChecklistService.cache({
  collection: Loans,
  type: 'many-inverse',
  fields: ['_id'],
  referenceField: 'closingChecklistLinks:_id',
  cacheField: 'closingLoanCache',
});
