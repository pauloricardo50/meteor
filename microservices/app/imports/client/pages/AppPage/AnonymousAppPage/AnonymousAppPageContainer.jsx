import React, { useEffect } from 'react';
import { compose, withProps, withState } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousLoanInsert } from 'core/api/loans/methodDefinitions';
import { anonymousLoan as anonymousLoanQuery } from 'core/api/loans/queries';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/users/userConstants';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../../startup/client/appRoutes';

export const withAnonymousLoan = compose(
  withState('anonymousLoanId', 'setAnonymousLoanId', () =>
    localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
  ),
  withSmartQuery({
    query: anonymousLoanQuery,
    skip: ({ anonymousLoanId }) => !anonymousLoanId,
    params: ({ anonymousLoanId }) => ({
      _id: anonymousLoanId,
      $body: {
        updatedAt: 1,
        name: 1,
        borrowers: { updatedAt: 1 },
        properties: { name: 1, address1: 1, totalValue: 1 },
        simpleBorrowersForm: 1,
      },
    }),
    deps: ({ anonymousLoanId }) => [anonymousLoanId],
    queryOptions: { single: true },
    dataName: 'anonymousLoan',
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
  Component => props => {
    const { anonymousLoanId, anonymousLoan, setAnonymousLoanId } = props;
    const hasInvalidAnonymousLoanId = anonymousLoanId && !anonymousLoan;

    useEffect(() => {
      if (hasInvalidAnonymousLoanId) {
        setAnonymousLoanId(undefined);
      }
    }, []);

    if (hasInvalidAnonymousLoanId) {
      return null;
    }

    return <Component {...props} />;
  },
);

export default compose(
  withAnonymousLoan,
  withProps(({ history }) => ({
    insertAnonymousLoan: ({ purchaseType } = {}) =>
      anonymousLoanInsert
        .run({
          referralId: localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined,
          existingAnonymousLoanId: localStorage.getItem(
            LOCAL_STORAGE_ANONYMOUS_LOAN,
          ),
          purchaseType,
        })
        .then(loanId => {
          localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, { loanId }));
        }),
  })),
);
