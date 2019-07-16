// @flow
import React from 'react';
import cx from 'classnames';

import { loanUpdate } from 'core/api/methods';
import { APPLICATION_TYPES, STEPS } from 'core/api/constants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import APP_ROUTES from 'imports/startup/client/appRoutes';
import UserCreator from 'imports/client/components/UserCreator/UserCreator';

type SimpleDashboardPageCTAsProps = {};

const SimpleDashboardPageCTAs = ({
  loanId,
  progress,
  currentUser,
  withReturnToDashboard = true,
}: SimpleDashboardPageCTAsProps) => {
  const buttonProps = {
    primary: progress < 1,
    secondary: progress >= 1,
    raised: true,
    label: <T id="BorrowersProgress.fullApplication" />,
    icon: <Icon type="right" />,
    iconAfter: true,
  };

  return (
    <div
      className={cx('simple-dashboard-page-ctas', {
        'one-button': !withReturnToDashboard,
      })}
    >
      {withReturnToDashboard && (
        <Button
          raised
          primary
          link
          to={createRoute(APP_ROUTES.DASHBOARD_PAGE.path, { loanId })}
        >
          Tableau de bord
        </Button>
      )}

      {!currentUser && <UserCreator buttonProps={buttonProps} />}

      {currentUser && (
        <ConfirmMethod
          buttonProps={buttonProps}
          method={() =>
            loanUpdate.run({
              loanId,
              object: {
                applicationType: APPLICATION_TYPES.FULL,
                step: STEPS.REQUEST,
              },
            })
          }
          title={<T id="BorrowersProgress.fullApplication" />}
          description={<T id="BorrowersProgress.fullApplicationDescription" />}
        />
      )}
    </div>
  );
};

export default SimpleDashboardPageCTAs;
