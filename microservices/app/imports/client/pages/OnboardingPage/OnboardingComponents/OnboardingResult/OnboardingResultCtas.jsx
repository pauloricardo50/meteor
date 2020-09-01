import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import CalendlyModal from 'core/components/Calendly/CalendlyModal';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../../startup/client/appRoutes';
import UserCreatorForm from '../../../../components/UserCreator/UserCreatorForm';
import { useOnboarding } from '../../OnboardingContext';

const OnboardingResultCtas = () => {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const {
    loan: { _id: loanId, hasCompletedOnboarding },
  } = useOnboarding();

  useEffect(() => {
    if (hasCompletedOnboarding) {
      history.push(createRoute(appRoutes.DASHBOARD_PAGE.path, { loanId }));
    }
  }, hasCompletedOnboarding);

  if (currentUser) {
    return (
      <div className="flex mt-40">
        <CalendlyModal
          buttonProps={{
            raised: true,
            primary: true,
            className: 'mr-16',
            label: <T id="OnboardingResultCtas.calendly" />,
          }}
        />

        <Button
          raised
          secondary
          onClick={() =>
            loanUpdate.run({ loanId, object: { hasCompletedOnboarding: true } })
          }
        >
          <T id="OnboardingResultCtas.goToDashboard" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex mt-40">
      <CalendlyModal
        buttonProps={{
          raised: true,
          primary: true,
          className: 'mr-16',
          label: <T id="OnboardingResultCtas.calendly" />,
        }}
      />

      <UserCreatorForm
        omitValues={['firstName', 'lastName', 'phoneNumber']}
        dialog
        submitFieldProps={{
          label: <T id="OnboardingResultCtas.goToDashboard" />,
          primary: true,
        }}
        buttonProps={{
          raised: true,
          secondary: true,
          label: <T id="OnboardingResultCtas.signup" />,
        }}
        description={
          <div className="flex-col onboarding-result-signup">
            <img src="/img/homepage-application.svg" alt="Demande de prêt" />

            <T id="OnboardingResultCtas.fullApplicationDescription" />
            <ul>
              <li>
                <T id="OnboardingResultCtas.fullApplicationDescription1" />
              </li>
              <li>
                <T id="OnboardingResultCtas.fullApplicationDescription2" />
              </li>
              <li>
                <T id="OnboardingResultCtas.fullApplicationDescription3" />
              </li>
            </ul>
          </div>
        }
      />
    </div>
  );
};

export default OnboardingResultCtas;
