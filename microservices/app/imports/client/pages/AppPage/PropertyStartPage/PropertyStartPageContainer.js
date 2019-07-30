import { Meteor } from 'meteor/meteor';

import { compose, withProps, lifecycle } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { anonymousProperty } from 'core/api/properties/queries';
import { createRoute } from 'core/utils/routerUtils';
import { anonymousLoanInsert, userLoanInsert } from 'core/api/methods';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/constants';
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
        address1: 1,
        description: 1,
        thumbnail: 1,
        name: 1,
        openGraphData: 1,
        totalValue: 1,
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
  lifecycle({
    componentDidMount() {
      // If a logged in user already has a loan with this property,
      // route him to it
      const { currentUser, history, propertyId } = this.props;
      if (currentUser) {
        const { loans = [] } = currentUser;
        const loanWithProperty = loans.find(({ properties }) =>
          properties.some(({ _id }) => _id === propertyId));

        if (loanWithProperty) {
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, {
            loanId: loanWithProperty._id,
          }));
        }
      }
    },
  }),
  withProps(({ propertyId, history }) => ({
    insertLoan: () => {
      if (Meteor.userId()) {
        return userLoanInsert.run({ proPropertyId: propertyId }).then(loanId =>
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, {
            loanId,
          })));
      }

      return anonymousLoanInsert
        .run({
          proPropertyId: propertyId,
          referralId: localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined,
          trackingId: parseCookies()[TRACKING_COOKIE],
        })
        .then((loanId) => {
          localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, loanId);
          history.push(createRoute(APP_ROUTES.DASHBOARD_PAGE.path, { loanId }));
        });
    },
  })),
);
