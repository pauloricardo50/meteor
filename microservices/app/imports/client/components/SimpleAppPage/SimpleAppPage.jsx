// @flow
import React from 'react';

import { APPLICATION_TYPES } from 'core/api/constants';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from 'imports/startup/client/appRoutes';

type SimpleAppPageProps = {};

const withSimpleAppPage = Component => (props: SimpleAppPageProps) => {
  const { loan, children } = props;

  if (loan && loan.applicationType === APPLICATION_TYPES.SIMPLE) {
    return (
      <>
        <Button
          link
          to={createRoute(DASHBOARD_PAGE, { loanId: loan._id })}
          style={{ alignSelf: 'flex-start', marginBottom: 16 }}
          raised
          primary
        >
          Home
        </Button>
        <Component {...props} />
      </>
    );
  }

  return <Component {...props} />;
};
export default withSimpleAppPage;
