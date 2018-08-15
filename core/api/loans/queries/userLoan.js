// @flow
import { Meteor } from 'meteor/meteor';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import type { structureType, loanTranchesType } from '../types';
import { userLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.USER_LOAN, {
  $filter({ filters, params: { loanId } }) {
    filters.userId = Meteor.userId();
    filters._id = loanId;
  },
  $postFilter(loans, params) {
    return loans.map(formatLoanWithStructure);
  },
  ...userLoanFragment,
});

export type userLoan = {
  _id: string,
  structures: Array<structureType>,
  selectedStructure: string,
  loanTranches: loanTranchesType,
};
