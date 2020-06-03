import React from 'react';
import { compose } from 'recompose';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { withSmartQuery } from 'core/api/containerToolkit';
import { formBorrower } from 'core/api/fragments';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

import { loanSummaryFragment } from '../../components/LoanSummaryList/LoanSummary';

export default compose(
  Component => props => (
    <Component {...props} key={props.match.params.borrowerId} />
  ),
  withSmartQuery({
    query: BORROWERS_COLLECTION,
    params: ({ match }) => ({
      $filters: { _id: match.params.borrowerId },
      ...formBorrower(),
      age: 1,
      createdAt: 1,
      loans: loanSummaryFragment,
      name: 1,
      updatedAt: 1,
      user: { name: 1, assignedEmployeeCache: 1 },
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'borrower',
  }),
  withTranslationContext(({ borrower }) => ({ gender: borrower.gender })),
);
