import { withProps, compose, withState, lifecycle } from 'recompose';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import anonymousLoan from 'core/api/loans/queries/anonymousLoan';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { anonymousLoanInsert } from 'core/api/methods';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from '../../../../startup/client/appRoutes';

export const withAnonymousLoan = compose(
  withState('anonymousLoanId', 'setAnonymousLoanId', () =>
    localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN)),
  withSmartQuery({
    query: anonymousLoan,
    params: ({ anonymousLoanId }) => ({
      _id: anonymousLoanId,
      $body: { updatedAt: 1, name: 1, borrowers: { updatedAt: 1 } },
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'anonymousLoan',
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
  lifecycle({
    componentDidMount() {
      if (this.props.anonymousLoanId && !this.props.anonymousLoan) {
        localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
        this.props.setAnonymousLoanId(undefined);
      }
    },
  }),
);

export default compose(
  withAnonymousLoan,
  withProps(({ history }) => ({
    insertAnonymousLoan: () =>
      anonymousLoanInsert.run({}).then((loanId) => {
        localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
        history.push(createRoute(DASHBOARD_PAGE, { loanId }));
      }),
  })),
);
