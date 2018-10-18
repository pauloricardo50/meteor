// @flow
import { Meteor } from 'meteor/meteor';
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import type { structureType, loanTranchesType } from '../types';
import { userLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.USER_LOAN, {
  $filter({ filters, params: { loanId } }) {
    filters.userId = Meteor.userId();
    filters._id = loanId;
  },
  ...userLoanFragment,
  promotions: {
    name: 1,
    address: 1,
    loans: {
      _id: 1,
      $filter({ filters, params: { loanId } }) {
        filters.userId = Meteor.userId();
        filters._id = loanId;
      },
    },
    $metadata: { priorityOrder: 1 },
  },
});

export type userLoan = {
  _id: string,
  structures: Array<structureType>,
  selectedStructure: string,
  loanTranches: loanTranchesType,
};
