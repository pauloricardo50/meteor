// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import userLoanQuery from 'core/api/loans/queries/userLoan';
import loanFiles from 'core/api/loans/queries/loanFiles';
import appUserQuery from 'core/api/users/queries/appUser';
import { mergeFilesIntoLoanStructure } from 'core/api/files/mergeFilesWithQuery';
import getBaseRedirect, {
  isOnAllowedRoute,
  isLogin,
} from 'core/utils/redirection';

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
  query: appUserQuery,
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});

const withUserLoan = withSmartQuery({
  query: userLoanQuery,
  params: ({ loanId }) => ({ loanId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'loan',
  renderMissingDoc: false,
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
  withRouter,
  withRedirect,
);
