import adminPropertyFragment from '../../../properties/queries/propertyFragments/adminPropertyFragment';
import userLoanFragment from './userLoanFragment';
import { adminLenderFragment } from '../../../lenders/queries/lendersFragments/lenderFragments';

export default {
  ...userLoanFragment,
  closingDate: 1,
  lenders: adminLenderFragment,
  properties: adminPropertyFragment,
  signingDate: 1,
  status: 1,
};
