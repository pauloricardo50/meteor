import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingChoice = ({ id, choices }) => {
  const { handleNextStep } = useOnboarding();

  return (
    <OnboardingStep
      title={<T id={`OnboardingStep.${id}.title`} />}
      description={<T id={`OnboardingStep.${id}.description`} />}
    >
      <div className="onboarding-choices">
        {choices.map(({ id: choiceId, icon, iconComponent }) => (
          <ButtonBase
            key={choiceId}
            onClick={() => {
              handleNextStep();
            }}
            className="flex-col center-align"
          >
            {iconComponent || (
              <FaIcon
                icon={icon}
                size="3x"
                className="mb-16"
                color={colors.duotoneIconColor}
              />
            )}
            <T id={`Forms.${id}.${choiceId}`} />
          </ButtonBase>
        ))}
      </div>
    </OnboardingStep>
  );
};

export default OnboardingChoice;
