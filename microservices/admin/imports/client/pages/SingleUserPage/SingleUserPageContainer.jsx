import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { USERS_COLLECTION } from 'core/api/users/userConstants';

import { loanSummaryFragment } from '../../components/LoanSummaryList/LoanSummary';

export default compose(
  withRouter,
  // Reload page on user change
  Component => props => (
    <Component key={props.userId || props.match.params.userId} {...props} />
  ),
  withSmartQuery({
    query: USERS_COLLECTION,
    params: ({ match, userId }) => ({
      $filters: { _id: userId || match.params.userId },
      assignedEmployeeCache: 1,
      roles: 1,
      loans: loanSummaryFragment,
      promotions: { name: 1, status: 1 },
      proProperties: {
        address1: 1,
        city: 1,
        createdAt: 1,
        loanCount: 1,
        status: 1,
        totalValue: 1,
        users: { name: 1 },
      },
      insuranceRequests: {
        borrowers: { name: 1 },
        createdAt: 1,
        name: 1,
        status: 1,
        updatedAt: 1,
      },
      acquisitionChannel: 1,
      assignedEmployeeId: 1,
      createdAt: 1,
      email: 1,
      emails: 1,
      firstName: 1,
      isDisabled: 1,
      lastName: 1,
      name: 1,
      office: 1,
      organisations: { name: 1 },
      phoneNumbers: 1,
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1 },
      roundRobinTimeout: 1,
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'user',
  }),
);
