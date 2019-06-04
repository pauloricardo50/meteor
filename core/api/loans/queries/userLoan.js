// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { userLoan } from '../../fragments';

export default Loans.createQuery(
  LOAN_QUERIES.USER_LOAN,
  {
    ...userLoan({ withSort: true, withFilteredPromotions: true }),
    maxPropertyValueExists: 1,
  },
  // https://github.com/cult-of-coders/grapher/issues/338
  { scoped: true },
);
