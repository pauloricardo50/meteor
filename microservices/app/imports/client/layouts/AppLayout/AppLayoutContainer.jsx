// @flow
import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoan from 'core/api/loans/queries/userLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import appUser from 'core/api/users/queries/appUser';
import currentInterestRates from 'core/api/interestRates/queries/currentInterestRates';
import { mergeFilesIntoLoanStructure } from 'core/api/files/mergeFilesWithQuery';
import getBaseRedirect, {
  isOnAllowedRoute,
  isLogin,
} from 'core/utils/redirection';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import {
  withSideNavContextProvider,
  withSideNavContext,
} from './SideNavContext';

const WITHOUT_LOAN = [
  '/profile',
  '/add-loan',
  '/enroll-account',
  '/reset-password',
];

const isOnAllowedRouteWithoutLoan = (loans, path) =>
  (!loans || loans.length < 1)
  && path !== '/'
  && !isOnAllowedRoute(path, WITHOUT_LOAN);

export const getRedirect = (currentUser, pathname) => {
  const baseRedirect = getBaseRedirect(currentUser, pathname);
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

const withAppUser = withSmartQuery({
  query: appUser,
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});

const withUserLoan = withSmartQuery({
  query: userLoan,
  params: ({ loanId }) => ({ loanId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  renderMissingDoc: ({ loanId }) => !!loanId,
});

const withInterestRates = withSmartQuery({
  query: currentInterestRates,
  queryOptions: { reactive: false, shouldRefetch: () => false },
  dataName: 'currentInterestRates',
  smallLoader: true,
  refetchOnMethodCall: false,
});

const withRedirect = withProps(({ currentUser, history }) => {
  const redirect = getRedirect(currentUser, history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
});

export default compose(
  withAppUser,
  withMatchParam('loanId', '/loans/:loanId'),
  // Reset the layout on loanId change, this avoids weird desync issues
  // because of mergeFilesIntoLoanStructure
  Component => props => (
    <React.Fragment key={props.loanId}>
      <Component {...props} />
    </React.Fragment>
  ),
  withUserLoan,
  mergeFilesIntoLoanStructure(loanFiles, ({ loanId }) => ({ loanId }), 'loan'),
  withInterestRates,
  mapProps(({ loan, currentInterestRates: { averageRates }, ...props }) => ({
    ...props,
    loan: { ...loan, currentInterestRates: averageRates },
  })),
  withRouter,
  withRedirect,
  withTranslationContext(({ loan = {} }) => ({
    purchaseType: loan.purchaseType,
  })),
  withSideNavContextProvider,
  withSideNavContext,
);
