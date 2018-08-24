// @flow
import React from 'react';
import Button from 'core/components/Button/Button';
import Dialog from 'core/components/Material/Dialog';
import T from 'core/components/Translation/Translation';
import NewLoanFormContainer, { STEPS_ARRAY } from './NewLoanFormContainer';
import NewLoanTextFields from './NewLoanFormTextFields';
import NewLoanFormButtons from './NewLoanFormButtons';

type NewLoanFormProps = {
  open: Boolean,
  step: Number,
};

export const NewLoanForm = (props: NewLoanFormProps) => {
  const { open, step } = props;
  return (
    <Dialog
      title={<T id="NewLoanForm.title" />}
      text={<T id={`NewLoanForm.${STEPS_ARRAY[step]}Text`} />}
      important
      open={open}
    >
      <form className="new-loan-form">
        <NewLoanTextFields {...props} />
        <div className="new-loan-form-buttons">
          <NewLoanFormButtons {...props} />
        </div>
      </form>
    </Dialog>
  );
};

export default NewLoanFormContainer(NewLoanForm);
