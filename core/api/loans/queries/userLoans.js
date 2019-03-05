// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { userLoan } from '../../fragments';

export default Loans.createQuery(
  LOAN_QUERIES.USER_LOANS,
  userLoan({ withSort: true, withFilteredPromotions: true }),
);
