import React from 'react';
import cx from 'classnames';

import { STEP_ORDER, STEPS, PROMOTION_OPTION_STATUS } from 'core/api/constants';
import ProgressBar from 'core/components/ProgressBar';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const DashboardProgressBar = ({ loan, variant }) => {
  const {
    step: currentStep,
    promotionOptions = [],
    promotions,
    maxPropertyValue,
  } = loan;
  let currentIndex = STEP_ORDER.indexOf(currentStep);
  let steps = STEP_ORDER.map(step => ({
    label: <T id={`Forms.step.${step}`} />,
    tooltip:
      step === STEPS.CLOSING ? (
        <Icon type="monetizationOn" size={40} />
      ) : (
        <T id={`Forms.step.${step}.tooltip`} />
      ),
  }));

  if (loan.hasPromotion) {
    currentIndex = 0;
    steps = [
      'purchasingCapacity',
      'reserveLot',
      'confirmReservation',
      'notarySignature',
    ].map(id => ({
      id,
      label: <T id={`PromotionSteps.${id}.title`} />,
      tooltip: (
        <T
          id={`PromotionSteps.${id}.tooltip`}
          values={{ agreementDuration: promotions[0].agreementDuration }}
        />
      ),
    }));

    if (loan.maxPropertyValue && loan.maxPropertyValue.date) {
      currentIndex = steps.findIndex(({ id }) => id === 'reserveLot');
    }

    if (
      promotionOptions.find(
        ({ status }) => status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      )
    ) {
      currentIndex = steps.findIndex(({ id }) => id === 'confirmReservation');
    }

    if (
      promotionOptions.find(
        ({ status }) => status === PROMOTION_OPTION_STATUS.RESERVED,
      )
    ) {
      currentIndex = steps.findIndex(({ id }) => id === 'notarySignature');
    }

    if (
      promotionOptions.find(
        ({ status }) => status === PROMOTION_OPTION_STATUS.SOLD,
      )
    ) {
      currentIndex = steps.findIndex(({ id }) => id === 'notarySignature') + 1;
    }
  }

  return (
    <ProgressBar
      className={cx('dashboard-progress-bar', { light: variant === 'light' })}
      steps={steps}
      currentIndex={currentIndex}
    />
  );
};

export default DashboardProgressBar;
