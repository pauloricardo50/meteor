// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { userLoan } from '../../fragments';

// console.log('userLoanFragment', userLoanFragment);
export default Loans.createQuery(LOAN_QUERIES.USER_LOAN, {
  $filter({ filters, params: { loanId } }) {
    filters._id = loanId;
  },
  ...userLoan({ withSort: true, withFilteredPromotions: true }),
});
