import React, { useState } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'classnames';

import ValidIcon from 'core/components/AutoForm/ValidIcon';
import { STATUS } from 'core/components/AutoForm/ValidIcon/ValidIconContainer';
import CalendlyModal from 'core/components/Calendly/CalendlyModal';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../OnboardingContext';
import OnboardingStep from './OnboardingStep';

const OnboardingButton = ({
  label,
  onClick,
  iconComponent,
  icon,
  loading,
  chosen,
}) => (
  <ButtonBase
    onClick={onClick}
    className={cx('flex-col center-align', {
      'no-icon': !iconComponent && !icon,
    })}
    focusRipple
  >
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

    {chosen && (
      <ValidIcon
        style={{ position: 'absolute', top: 0, right: 0 }}
        status={STATUS.SUCCESS}
      />
    )}
  </ButtonBase>
);

const OnboardingChoice = ({ id, choices, onSubmit }) => {
  const { handleNextStep, steps } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const currentValue = steps.find(({ id: stepId }) => stepId === id).value;

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
                        icon: <Icon type="event" />,
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
                chosen={choiceId === currentValue}
              />
            );
          },
        )}
      </div>
    </OnboardingStep>
  );
};

export default OnboardingChoice;
