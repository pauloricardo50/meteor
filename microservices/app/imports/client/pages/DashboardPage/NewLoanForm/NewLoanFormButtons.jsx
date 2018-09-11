// @flow
import React, { Fragment } from 'react';
import findKey from 'lodash/findKey';
import Button from 'core/components/Button/Button';
import T from 'core/components/Translation/Translation';
import { STEPS_ARRAY, STEPS } from './NewLoanFormContainer';

type NewLoanFormButtonsProps = {
  step: Number,
  numberOfSteps: Number,
  handleNext: Function,
  handlePrevious: Function,
  handleSubmit: Function,
};

const shouldDisableButton = ({ step, props }) => {
  const currentStepKey = findKey(
    STEPS,
    stepKey => stepKey.name === STEPS_ARRAY[step],
  );
  return STEPS[currentStepKey].optional === false && !props[STEPS_ARRAY[step]];
};

const NewLoanFormButtons = (props: NewLoanFormButtonsProps) => {
  const {
    step,
    numberOfSteps,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = props;
  return (
    <Fragment>
      {step === 0 ? null : (
        <Button
          id="previous"
          onClick={handlePrevious}
          label={<T id="NewLoanForm.previousButton" />}
          raised
        />
      )}
      {step === numberOfSteps - 1 ? (
        <Button
          type="submit"
          id="submit"
          onClick={handleSubmit}
          label={<T id="NewLoanForm.submitButton" />}
          secondary
          raised
          disabled={shouldDisableButton({ step, props })}
        />
      ) : (
        <Button
          type="submit"
          id="next"
          onClick={handleNext}
          label={<T id="NewLoanForm.nextButton" />}
          primary
          raised
          disabled={shouldDisableButton({ step, props })}
        />
      )}
    </Fragment>
  );
};

export default NewLoanFormButtons;
