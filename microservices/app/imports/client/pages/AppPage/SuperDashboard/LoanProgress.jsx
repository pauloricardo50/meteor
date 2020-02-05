//
import React from 'react';
import cx from 'classnames';

import { STEP_ORDER } from 'core/api/constants';
import T from 'core/components/Translation';

const isDone = (currentStep, step) => {
  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const stepIndex = STEP_ORDER.indexOf(step);

  return currentStepIndex >= stepIndex;
};

const LoanProgress = ({ step: currentStep }) => (
  <div className="loan-progress">
    <h4 className="secondary">
      <T id={`Forms.step.${currentStep}`} />
    </h4>
    <div className="flex-row">
      {STEP_ORDER.map(step => (
        <div
          className={cx('step', { done: isDone(currentStep, step) })}
          key={step}
        />
      ))}
    </div>
  </div>
);

export default LoanProgress;
