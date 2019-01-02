// @flow
import { Meteor } from 'meteor/meteor';
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import type { structureType, loanTranchesType } from '../types';
import { userLoan } from '../../fragments';

// console.log('userLoanFragment', userLoanFragment);
export default Loans.createQuery(LOAN_QUERIES.USER_LOAN, {
  $filter({ filters, params: { loanId } }) {
    filters.userId = Meteor.userId();
    filters._id = loanId;
  },
  ...userLoan({ withSort: true, withFilteredPromotions: true }),
});
