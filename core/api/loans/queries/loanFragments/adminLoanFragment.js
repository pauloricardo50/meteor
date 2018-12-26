import adminPropertyFragment from '../../../properties/queries/propertyFragments/adminPropertyFragment';
import userLoanFragment from './userLoanFragment';

export default {
  ...userLoanFragment,
  closingDate: 1,
  properties: adminPropertyFragment,
  signingDate: 1,
  status: 1,
};
