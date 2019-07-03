import { withProps, compose, withState, lifecycle } from 'recompose';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousLoan } from 'core/api/loans/queries';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { anonymousLoanInsert } from 'core/api/methods';
import { createRoute } from 'core/utils/routerUtils';
import { parseCookies } from 'core/utils/cookiesHelpers';
import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import APP_ROUTES from '../../../../startup/client/appRoutes';

export const withAnonymousLoan = compose(
  withState('anonymousLoanId', 'setAnonymousLoanId', () =>
    localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN)),
  withSmartQuery({
    query: anonymousLoan,
    skip: ({ anonymousLoanId }) => !anonymousLoanId,
    params: ({ anonymousLoanId }) => ({
      _id: anonymousLoanId,
      $body: {
        updatedAt: 1,
        name: 1,
        borrowers: { updatedAt: 1 },
        properties: { name: 1, address1: 1, totalValue: 1 },
      },
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
      anonymousLoanInsert
        .run({ trackingId: parseCookies()[TRACKING_COOKIE] })
        .then((loanId) => {
          localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, {
            loanId,
          }));
        }),
  })),
);
