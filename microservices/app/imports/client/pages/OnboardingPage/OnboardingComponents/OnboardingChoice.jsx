import React, { useState } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import CalendlyModal from 'core/components/Calendly/CalendlyModal';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingButton = ({ label, onClick, iconComponent, icon, loading }) => (
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

    {loading && (
      <div className="onboarding-choices-loader animated fadeIn delays-200">
        <Icon type="loop-spin" color="borderGrey" />
      </div>
    )}
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
            ctaId,
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

                  <div className="text-center">
                    <CalendlyModal
                      buttonProps={{
                        raised: true,
                        primary: true,
                        label: <T id="OnboardingResultCtas.calendly" />,
                        className: 'mt-32',
                        ctaId,
                      }}
                    />
                  </div>
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

                  setLoading(choiceId);
                  onSubmit(choiceId)
                    .then(() => handleNextStep())
                    .catch(() => setLoading(false));
                }}
                icon={icon}
                iconComponent={iconComponent}
                label={label}
                loading={choiceId === loading}
              />
            );
          },
        )}
      </div>
    </OnboardingStep>
  );
};

export default OnboardingChoice;
