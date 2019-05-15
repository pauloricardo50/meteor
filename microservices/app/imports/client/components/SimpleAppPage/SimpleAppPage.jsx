// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometer } from '@fortawesome/pro-light-svg-icons/faTachometer';

import { APPLICATION_TYPES } from 'core/api/constants';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import ROUTES from 'imports/startup/client/appRoutes';

type SimpleAppPageProps = {};

const withSimpleAppPage = Component => (props: SimpleAppPageProps) => {
  const { loan, children } = props;

  if (loan && loan.applicationType === APPLICATION_TYPES.SIMPLE) {
    return (
      <>
        <Button
          link
          to={createRoute(ROUTES.DASHBOARD_PAGE.path, { loanId: loan._id })}
          style={{ alignSelf: 'flex-start', marginBottom: 16 }}
          raised
          primary
          icon={<FontAwesomeIcon icon={faTachometer} />}
        >
          Tableau de bord
        </Button>
        <Component {...props} />
      </>
    );
  }

  return <Component {...props} />;
};
export default withSimpleAppPage;
