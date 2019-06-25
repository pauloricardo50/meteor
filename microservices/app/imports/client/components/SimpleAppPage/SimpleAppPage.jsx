// @flow
import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';
import DashboardProgressBar from 'imports/client/pages/DashboardPage/DashboardProgress/DashboardProgressBar';

type SimpleAppPageProps = {};

const withSimpleAppPage = Component => (props: SimpleAppPageProps) => {
  const { loan, children } = props;

  if (loan && loan.applicationType === APPLICATION_TYPES.SIMPLE) {
    return (
      <>
        <DashboardProgressBar currentStep={loan.step} variant="light" />
        <Component {...props} />
      </>
    );
  }

  return <Component {...props} />;
};
export default withSimpleAppPage;
