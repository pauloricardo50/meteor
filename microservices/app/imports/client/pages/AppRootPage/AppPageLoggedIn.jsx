import React from 'react';
import { Redirect } from 'react-router-dom';

import useCurrentUser from 'core/hooks/useCurrentUser';

import appRoutes from '../../../startup/client/appRoutes';

const AppPageLoggedIn = () => {
  const currentUser = useCurrentUser();
  const { loans, isPro } = currentUser;

  if (isPro) {
    return <Redirect to={appRoutes.PRO_PAGE.path} />;
  }

  if (loans.length === 1) {
    return <Redirect to={`/loans/${loans[0]._id}`} />;
  }

  if (loans.length > 0) {
    return <Redirect to={appRoutes.USER_LOANS_PAGE.path} />;
  }

  // No loans
  return <Redirect to={appRoutes.ONBOARDING_PAGE.path} />;
};

export default AppPageLoggedIn;
