// @flow
import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';
import DashboardProgressBar from 'imports/client/pages/DashboardPage/DashboardProgress/DashboardProgressBar';
import SimpleDashboardPageCTAs from 'imports/client/pages/SimpleDashboardPage/SimpleDashboardPageCTAs';
import Calculator from 'core/utils/Calculator';

type SimpleAppPageProps = {};

const withSimpleAppPage = Component => (props: SimpleAppPageProps) => {
  const { loan, children, currentUser } = props;
  const progress = Calculator.personalInfoPercentSimple({ loan });

  if (loan && loan.applicationType === APPLICATION_TYPES.SIMPLE) {
    return (
      <>
        <DashboardProgressBar loan={loan} variant="light" />
        <SimpleDashboardPageCTAs
          loanId={loan._id}
          progress={progress}
          currentUser={currentUser}
        />
        <Component {...props} />
      </>
    );
  }

  return <Component {...props} />;
};
export default withSimpleAppPage;
