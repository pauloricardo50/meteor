import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingChoice = ({ id, choices }) => {
  const {} = useOnboarding();

  return (
    <OnboardingStep>
      <div>
        {choices.map(({ id: choiceId, icon }) => (
          <ButtonBase key={choiceId} onClick={() => {}}>
            <FaIcon icon={icon} />
            <T id={`OnboardingChoice.${choiceId}`} />
          </ButtonBase>
        ))}
      </div>
    </OnboardingStep>
  );
};

export default OnboardingChoice;
