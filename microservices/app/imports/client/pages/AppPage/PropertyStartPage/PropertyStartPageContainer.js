import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import anonymousProperty from 'core/api/properties/queries/anonymousProperty';
import { createRoute } from 'core/utils/routerUtils';
import { anonymousLoanInsert } from 'core/api/methods';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { parseCookies } from 'core/utils/cookiesHelpers';
import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import APP_ROUTES from '../../../../startup/client/appRoutes';

export default compose(
  withSmartQuery({
    query: anonymousProperty,
    params: ({ propertyId }) => ({
      _id: propertyId,
      $body: {
        name: 1,
        address1: 1,
        totalValue: 1,
        description: 1,
        openGraphData: 1,
        documents: 1,
      },
    }),
    queryOptions: {
      single: true,
      shouldRefetch: ({ propertyId }, { propertyId: nextPropertyId }) =>
        nextPropertyId !== propertyId,
    },
    dataName: 'anonymousProperty',
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
  withProps(({ propertyId, referralId, history }) => ({
    insertAnonymousLoan: () =>
      anonymousLoanInsert
        .run({
          proPropertyId: propertyId,
          referralId,
          trackingId: parseCookies()[TRACKING_COOKIE],
        })
        .then((loanId) => {
          localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
          window.analytics.alias(loanId);
          history.push(createRoute(APP_ROUTES.BORROWERS_PAGE.path, { loanId, tabId: '' }));
        }),
  })),
);
