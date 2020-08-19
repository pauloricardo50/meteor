import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import useCurrentUser from 'core/hooks/useCurrentUser';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';
import PageApp from '../../components/PageApp';
import WelcomeScreen from '../../components/WelcomeScreen';
import DashboardInfo from './DashboardInfo';
import DashboardProgress from './DashboardProgress';
import DashboardRecap from './DashboardRecap';

const DashboardPage = props => {
  const { loan } = props;
  const [, rerender] = useState(); // Use this to rerender after changing the window object
  const currentUser = useCurrentUser();
  const hasTodoOnboarding =
    currentUser === null || !loan.maxPropertyValue?.date;

  if (loan.displayWelcomeScreen && !window.hideWelcomeScreen) {
    return <WelcomeScreen rerender={rerender} />;
  }

  if (hasTodoOnboarding) {
    return (
      <Redirect
        to={createRoute(appRoutes.LOAN_ONBOARDING_PAGE.path, {
          loanId: loan._id,
        })}
      />
    );
  }

  return (
    <PageApp id="DashboardPage" fullWidth>
      <DashboardProgress {...props} />
      <DashboardRecap {...props} />
      <DashboardInfo {...props} />
    </PageApp>
  );
};

export default DashboardPage;
