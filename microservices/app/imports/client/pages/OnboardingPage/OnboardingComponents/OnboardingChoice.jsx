import React, { useState } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import DialogSimple from 'core/components/DialogSimple';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingButton = ({ label, onClick, iconComponent, icon }) => (
  <ButtonBase onClick={onClick} className="flex-col center-align" focusRipple>
    {iconComponent ||
      (icon ? (
        <FaIcon
          icon={icon}
          size="3x"
          className="mb-16"
          color={colors.duotoneIconColor}
        />
      ) : null)}

    {label}
  </ButtonBase>
);

const OnboardingChoice = ({ id, choices, onSubmit }) => {
  const { handleNextStep } = useOnboarding();
  const [loading, setLoading] = useState(false);

  return (
    <OnboardingStep>
      <div className="onboarding-choices">
        {choices.map(
          ({
            id: choiceId,
            icon,
            iconComponent,
            modalId,
            label = <T id={`Forms.${id}.${choiceId}`} />,
          }) => {
            if (modalId) {
              return (
                <DialogSimple
                  key={choiceId}
                  renderTrigger={({ handleOpen }) => (
                    <OnboardingButton
                      choiceId={choiceId}
                      onClick={handleOpen}
                      icon={icon}
                      iconComponent={iconComponent}
                      label={label}
                    />
                  )}
                  title={<T id={`${modalId}.title`} />}
                  closeOnly
                >
                  <T id={`${modalId}.description`} />
                </DialogSimple>
              );
            }

            return (
              <OnboardingButton
                key={choiceId}
                choiceId={choiceId}
                id={id}
                onClick={() => {
                  if (loading) {
                    return;
                  }

                  setLoading(true);
                  onSubmit(choiceId)
                    .then(() => handleNextStep())
                    .finally(() => setLoading(false));
                }}
                icon={icon}
                iconComponent={iconComponent}
                label={label}
              />
            );
          },
        )}
      </div>
    </OnboardingStep>
  );
};

export default OnboardingChoice;
