// @flow
import { useContext } from 'react';
import { compose, withProps, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { userLoans } from 'core/api/loans/queries';
import { userImpersonatedSession } from 'core/api/sessions/queries';
import { currentInterestRates } from 'core/api/interestRates/queries';
import getBaseRedirect, {
  isOnAllowedRoute,
  isLogin,
} from 'core/utils/redirection';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import { withContactButtonProvider } from 'core/components/ContactButton/ContactButtonContext';
import { injectCalculator } from 'core/containers/withCalculator';
import { userLoan } from 'core/api/fragments';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import {
  withSideNavContextProvider,
  withSideNavContext,
} from './SideNavContext';

const WITHOUT_LOAN = [
  '/account',
  '/add-loan',
  '/enroll-account',
  '/reset-password',
];

const WITHOUT_LOGIN = ['/', '/loans', '/borrowers', '/properties', '/signup'];

const isOnAllowedRouteWithoutLoan = (loans, path) =>
  (!loans || loans.length < 1) &&
  path !== '/' &&
  !isOnAllowedRoute(path, WITHOUT_LOAN);

export const getRedirect = (currentUser, pathname) => {
  const baseRedirect = getBaseRedirect(currentUser, pathname, WITHOUT_LOGIN);
  if (baseRedirect !== undefined) {
    return baseRedirect;
  }

  // If there is no active loan, force route to app page, except if
  // user is on allowed routes
  const { loans } = currentUser;
  if (isOnAllowedRouteWithoutLoan(loans, pathname)) {
    return '/';
  }

  return false;
};

const fullFragment = userLoan({ withSort: true, withFilteredPromotions: true });
const fragment = {
  ...fullFragment,
  user: { _id: 1 },
  properties: {
    ...fullFragment.properties,
    loans: undefined,
    user: undefined,
  },
  promotions: {
    ...fullFragment.promotions,
    users: undefined,
  },
  maxPropertyValueExists: 1,
};

const withUserLoan = withSmartQuery({
  query: userLoans,
  params: ({ loanId }) => ({ loanId, $body: fragment }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  skip: ({ loanId }) => !loanId,
});

const withInterestRates = withSmartQuery({
  query: currentInterestRates,
  queryOptions: { shouldRefetch: () => false },
  dataName: 'currentInterestRates',
  refetchOnMethodCall: false,
});

const withRedirect = withProps(({ history }) => {
  const currentUser = useContext(CurrentUserContext);
  const redirect = getRedirect(currentUser, history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
});

const withImpersonatedSession = withSmartQuery({
  query: userImpersonatedSession,
  queryOptions: { reactive: true, single: true },
  dataName: 'impersonatedSession',
  renderMissingDoc: false,
});

export default compose(
  withMatchParam('loanId', '/loans/:loanId'),
  withUserLoan,
  injectCalculator(),
  withInterestRates,
  mapProps(
    ({
      loan,
      query,
      refetch,
      currentInterestRates: { averageRates },
      ...props
    }) => ({
      ...props,
      loan: { ...loan, currentInterestRates: averageRates },
    }),
  ),
  withRouter,
  withRedirect,
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withSideNavContextProvider,
  withSideNavContext,
  withContactButtonProvider,
  withImpersonatedSession,
);
