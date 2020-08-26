import React from 'react';
import { Redirect } from 'react-router-dom';

import useCurrentUser from 'core/hooks/useCurrentUser';
import useSearchParams from 'core/hooks/useSearchParams';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';

const AppPageLoggedIn = () => {
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  const { loans, isPro } = currentUser;

  // TODO: Handle promotion-id
  if (searchParams['property-id']) {
    return (
      <Redirect
        to={createRoute(appRoutes.APP_PRO_PROPERTY_PAGE.path, {
          propertyId: searchParams['property-id'],
        })}
      />
    );
  }

  if (isPro) {
    return <Redirect to={appRoutes.PRO_PAGE.path} />;
  }

  if (loans.length === 1) {
    return (
      <Redirect
        to={createRoute(appRoutes.DASHBOARD_PAGE.path, {
          loanId: loans[0]._id,
        })}
      />
    );
  }

  if (loans.length > 0) {
    return <Redirect to={appRoutes.USER_LOANS_PAGE.path} />;
  }

  // No loans
  return <Redirect to={appRoutes.ONBOARDING_PAGE.path} />;
};

export default AppPageLoggedIn;
