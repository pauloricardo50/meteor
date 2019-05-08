import { withProps, compose } from 'recompose';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import anonymousLoan from 'core/api/loans/queries/anonymousLoan';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { anonymousLoanInsert } from 'core/api/methods';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from '../../../../startup/client/appRoutes';

export default compose(
  withSmartQuery({
    query: anonymousLoan,
    params: () => {
      let loanId;
      loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);

      if (!loanId) {
        loanId = sessionStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      }

      return { _id: loanId };
    },
    queryOptions: { reactive: false, single: true },
    dataName: 'anonymousLoan',
    renderMissingDoc: false,
  }),
  withProps(({ history }) => ({
    insertAnonymousLoan: () =>
      anonymousLoanInsert.run({}).then((loanId) => {
        localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
        history.push(createRoute(DASHBOARD_PAGE, { loanId }));
      }),
  })),
);
