import React from 'react';
import cx from 'classnames';

import { APPLICATION_TYPES, STEPS } from 'core/api/loans/loanConstants';
import { loanUpdate } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import ConfirmMethod from 'core/components/ConfirmMethod';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import pollUntilReady from 'core/utils/pollUntilReady';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';
import UserCreator from '../../components/UserCreator/UserCreator';

// On some slow connections/devices, the new UI is not reloaded properly, this forces
// it to appear
const fullApplication = loanId =>
  loanUpdate
    .run({
      loanId,
      object: {
        applicationType: APPLICATION_TYPES.FULL,
        step: STEPS.REQUEST,
      },
    })
    .then(
      () =>
        pollUntilReady(() => {
          const els = document.getElementsByClassName('dashboard-progress');
          return els.length > 0;
        }),
      100,
      4000,
    )
    .catch(() => {
      // If the new dashboard does not reload in 4 seconds, reload the page
      window.location.reload();
    });

// Use this function to coordinate the proper highlight of the various CTA
// on the page. There should almost always be a single secondary CTA,
// otherwise the user can get lost
export const shouldHighlightNextStep = maxPropertyValue =>
  !!(maxPropertyValue && maxPropertyValue.date);

const SimpleDashboardPageCTAs = ({
  loanId,
  currentUser,
  withReturnToDashboard = true,
  maxPropertyValue,
}) => {
  const highlightNextStep = shouldHighlightNextStep(maxPropertyValue);
  const buttonProps = {
    primary: !highlightNextStep,
    secondary: highlightNextStep,
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

      {!currentUser && (
        <UserCreator buttonProps={buttonProps} ctaId="fullApplication" />
      )}

      {currentUser && (
        <ConfirmMethod
          type="modal"
          buttonProps={buttonProps}
          method={() => fullApplication(loanId)}
          title={<T id="BorrowersProgress.fullApplication" />}
          description={
            <div className="full-application-description">
              <img src="/img/homepage-application.svg" alt="Demande de prêt" />
              <T id="BorrowersProgress.fullApplicationDescription" />
              <ul>
                <li>
                  <T id="BorrowersProgress.fullApplicationDescription1" />
                </li>
                <li>
                  <T id="BorrowersProgress.fullApplicationDescription2" />
                </li>
                <li>
                  <T id="BorrowersProgress.fullApplicationDescription3" />
                </li>
              </ul>

              <small>
                <T id="BorrowersProgress.fullApplicationDescription4" />
              </small>
            </div>
          }
        />
      )}
    </div>
  );
};

export default SimpleDashboardPageCTAs;
