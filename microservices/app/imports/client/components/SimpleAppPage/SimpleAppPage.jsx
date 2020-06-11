import React from 'react';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

import DashboardProgressBar from '../../pages/DashboardPage/DashboardProgress/DashboardProgressBar';
import SimpleDashboardPageCTAs from '../../pages/SimpleDashboardPage/SimpleDashboardPageCTAs';

const withSimpleAppPage = Component => props => {
  const { loan, currentUser } = props;
  const { maxPropertyValue } = loan;

  if (loan && loan.applicationType === APPLICATION_TYPES.SIMPLE) {
    return (
      <>
        <DashboardProgressBar loan={loan} variant="light" />
        <SimpleDashboardPageCTAs
          loanId={loan._id}
          currentUser={currentUser}
          maxPropertyValue={maxPropertyValue}
        />
        <Component {...props} />
      </>
    );
  }

  return <Component {...props} />;
};
export default withSimpleAppPage;
