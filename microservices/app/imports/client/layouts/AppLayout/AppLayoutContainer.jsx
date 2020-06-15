import merge from 'lodash/merge';
import { withRouter } from 'react-router-dom';
import { compose, mapProps, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { calculatorLoan } from 'core/api/fragments';
import { currentInterestRates } from 'core/api/interestRates/queries';
import { userLoans } from 'core/api/loans/queries';
import { withContactButtonProvider } from 'core/components/ContactButton/ContactButtonContext';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import { injectCalculator } from 'core/containers/withCalculator';
import withMatchParam from 'core/containers/withMatchParam';
import useCurrentUser from 'core/hooks/useCurrentUser';
import getBaseRedirect, {
  isLogin,
  isOnAllowedRoute,
} from 'core/utils/redirection';

import {
  withSideNavContext,
  withSideNavContextProvider,
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

const fragment = merge({}, calculatorLoan(), {
  applicationType: 1,
  borrowers: { age: 1, name: 1, $options: { sort: { createdAt: 1 } } },
  contacts: 1,
  customName: 1,
  displayWelcomeScreen: 1,
  enableOffers: 1,
  lenders: {
    offers: {
      enableOffer: 1,
      conditions: 1,
      withCounterparts: 1,
    },
    organisation: { logo: 1 },
  },
  userCache: 1,
  name: 1,
  promotionOptions: {
    name: 1,
    priorityOrder: 1,
    promotionLots: { reducedStatus: 1, value: 1 },
  },
  promotions: {
    name: 1,
    lenderOrganisationLink: 1,
    status: 1,
    documents: 1,
    users: { name: 1, organisations: { name: 1 } },
  },
  properties: { address: 1, $options: { sort: { createdAt: 1 } } },
  shareSolvency: 1,
  step: 1,
  userFormsEnabled: 1,
  maxPropertyValue: 1,
  maxPropertyValueExists: 1,
});

const withUserLoan = withSmartQuery({
  query: userLoans,
  params: ({ loanId }) => ({ loanId, $body: fragment }),
  deps: ({ loanId }) => {
    // Make sure the currentUser is in the dependencies here, or else
    // the query can get stuck when it's undefined on initial launch
    const currentUser = useCurrentUser();
    return [loanId, currentUser?._id];
  },
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  skip: ({ loanId }) => !loanId,
});

const withInterestRates = withSmartQuery({
  query: currentInterestRates,
  dataName: 'currentInterestRates',
  refetchOnMethodCall: false,
});

const withRedirect = withProps(({ history }) => {
  const currentUser = useCurrentUser();
  const redirect = getRedirect(currentUser, history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
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
);
