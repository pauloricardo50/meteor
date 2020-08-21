import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../../../startup/client/appRoutes';
import UserCreatorForm from '../../../../components/UserCreator/UserCreatorForm';
import { useOnboarding } from '../../OnboardingContext';

const OnboardingResultCtas = () => {
  const currentUser = useCurrentUser();
  const {
    loan: { _id: loanId },
  } = useOnboarding();

  if (currentUser) {
    return (
      <div className="flex mt-40">
        <Button raised primary className="mr-16">
          <T id="OnboardingResultCtas.calendly" />
        </Button>

        <Button
          link
          to={createRoute(appRoutes.DASHBOARD_PAGE.path, { loanId })}
          raised
          secondary
        >
          <T id="OnboardingResultCtas.goToDashboard" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex mt-40">
      <Button raised secondary className="mr-16">
        <T id="OnboardingResultCtas.calendly" />
      </Button>

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
