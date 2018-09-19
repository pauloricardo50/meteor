import './testFactories';
import { Factory } from 'meteor/dburles:factory';
import Loans from 'core/api/loans/loans';
import { adminLoanFragment } from 'core/api/loans/queries/loanFragments/index';

import { fakeBorrower } from './fakes';

export const getSingleBorrowerLoan = (options) => {
  const borrowerId = Factory.create('testBorrower', fakeBorrower(options))._id;
  const propertyId = Factory.create('testProperty')._id;

  return Factory.create('testLoan', {
    borrowerIds: [borrowerId],
    propertyIds: [propertyId],
  })._id;
};

export const getTwoBorrowersLoan = (options) => {
  const borrower1Id = Factory.create(
    'testBorrower',
    fakeBorrower({ ...options[0] }),
  )._id;
  const borrower2Id = Factory.create(
    'testBorrower',
    fakeBorrower({ ...options[1] }),
  )._id;
  const propertyId = Factory.create('testProperty')._id;

  return Factory.create('testLoan', {
    borrowerIds: [borrower1Id, borrower2Id],
    propertyIds: [propertyId],
  })._id;
};

export const getFullLoan = loanId =>
  Loans.createQuery('', {
    $filter({ filters, params }) {
      filters._id = params.id;
    },
    ...adminLoanFragment,
  })
    .clone({ id: loanId })
    .fetchOne();
