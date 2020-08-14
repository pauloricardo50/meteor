import { useHistory } from 'react-router-dom';

import useCurrentUser from 'core/hooks/useCurrentUser';
import getBaseRedirect, {
  isLogin,
  isOnAllowedRoute,
} from 'core/utils/redirection';

const WITHOUT_LOAN = [
  '/account',
  '/add-loan',
  '/enroll-account',
  '/reset-password',
];

const WITHOUT_LOGIN = [
  '/',
  '/loans',
  '/borrowers',
  '/properties',
  '/signup',
  '/onboarding',
];

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

export const useAppRedirect = () => {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const redirect = getRedirect(currentUser, history.location.pathname);
  return !isLogin(history.location.pathname) && redirect;
};
