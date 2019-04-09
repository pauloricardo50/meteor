// @flow
import React from 'react';

import { loanUpdate } from 'core/api/methods';
import { APPLICATION_TYPES } from 'core/api/constants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import { WELCOME_PAGE } from 'imports/startup/client/appRoutes';

type SimpleDashboardPageCTAsProps = {};

const SimpleDashboardPageCTAs = ({ loanId }: SimpleDashboardPageCTAsProps) => (
  <div className="simple-dashboard-page-ctas">
    <Button raised primary link to={createRoute(WELCOME_PAGE, { loanId })}>
      <T id="BorrowersProgress.welcomePage" />
    </Button>
    <ConfirmMethod
      buttonProps={{
        primary: true,
        raised: true,
        label: <T id="BorrowersProgress.fullApplication" />,
        icon: <Icon type="right" />,
        iconAfter: true,
      }}
      method={() =>
        loanUpdate.run({
          loanId,
          object: { applicationType: APPLICATION_TYPES.FULL },
        })
      }
      title={<T id="BorrowersProgress.fullApplication" />}
      description={<T id="BorrowersProgress.fullApplicationDescription" />}
    />
  </div>
);

export default SimpleDashboardPageCTAs;
