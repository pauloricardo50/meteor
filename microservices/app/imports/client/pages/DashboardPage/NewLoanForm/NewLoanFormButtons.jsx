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

const shouldDisableButton = ({ stepName, stepValue }) => {
  const currentStepKey = findKey(STEPS, stepKey => stepKey.name === stepName);
  return STEPS[currentStepKey].optional === false && !stepValue;
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
    <>
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
          disabled={shouldDisableButton({
            stepName: STEPS_ARRAY[step],
            stepValue: props[STEPS_ARRAY[step]],
          })}
        />
      ) : (
        <Button
          type="submit"
          id="next"
          onClick={handleNext}
          label={<T id="NewLoanForm.nextButton" />}
          primary
          raised
          disabled={shouldDisableButton({
            stepName: STEPS_ARRAY[step],
            stepValue: props[STEPS_ARRAY[step]],
          })}
        />
      )}
    </>
  );
};

export default NewLoanFormButtons;
