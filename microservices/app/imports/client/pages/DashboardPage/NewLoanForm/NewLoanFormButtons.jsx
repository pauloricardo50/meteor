// @flow
import React, { Fragment } from 'react';
import Button from 'core/components/Button/Button';
import T from 'core/components/Translation/Translation';
import { STEPS_ARRAY } from './NewLoanFormContainer';

type NewLoanFormButtonsProps = {
  step: Number,
  numberOfSteps: Number,
  handleNext: Function,
  handlePrevious: Function,
  handleSubmit: Function,
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
          disabled={!props[STEPS_ARRAY[step]]}
        />
      ) : (
        <Button
          type="submit"
          id="next"
          onClick={handleNext}
          label={<T id="NewLoanForm.nextButton" />}
          primary
          raised
          disabled={!props[STEPS_ARRAY[step]]}
        />
      )}
    </Fragment>
  );
};

export default NewLoanFormButtons;
