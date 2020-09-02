import React, { useEffect } from 'react';
import cx from 'classnames';
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

export const OnboardingResultCtaDefault = ({ loanId, buttonSize }) => {
  const currentUser = useCurrentUser();

  if (currentUser) {
    return (
      <Button
        raised
        secondary
        onClick={() =>
          loanUpdate.run({ loanId, object: { hasCompletedOnboarding: true } })
        }
        className="mb-8"
        size={buttonSize}
      >
        <T id="OnboardingResultCtas.goToDashboard" />
      </Button>
    );
  }

  return (
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
        className: 'mb-8',
        size: buttonSize,
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
  );
};
const OnboardingResultCtas = () => {
  const history = useHistory();
  const {
    loan: { _id: loanId, hasCompletedOnboarding },
    isMobile,
  } = useOnboarding();
  const buttonSize = isMobile ? 'medium' : 'large';

  useEffect(() => {
    if (hasCompletedOnboarding) {
      history.push(createRoute(appRoutes.DASHBOARD_PAGE.path, { loanId }));
    }
  }, hasCompletedOnboarding);

  return (
    <div className={cx('flex mt-40', { fe: isMobile })}>
      <CalendlyModal
        buttonProps={{
          raised: true,
          primary: true,
          className: 'mr-8 mb-8',
          label: <T id="OnboardingResultCtas.calendly" />,
          size: buttonSize,
        }}
      />

      <OnboardingResultCtaDefault loanId={loanId} buttonSize={buttonSize} />
    </div>
  );
};

export default OnboardingResultCtas;
