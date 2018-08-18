// @flow
import React from 'react';
import T from 'core/components/Translation';
import TextInput from 'core/components/TextInput';
import { STEPS_ARRAY, STEPS } from './NewLoanFormContainer';

// const TextFieldValueTypes = ['text', 'money', 'money', 'money'];

const TextFieldValueTypes = {
  [STEPS.LOAN_NAME]: 'text',
  [STEPS.PROPERTY_VALUE]: 'money',
  [STEPS.BORROWER_SALARY]: 'money',
  [STEPS.BORROWER_FORTUNE]: 'money',
};

type NewLoanFormTextFieldsProps = {
  step: Number,
  handleChange: Function,
};

const NewLoanFormTextFields = (props: NewLoanFormTextFieldsProps) => {
  const { step, handleChange } = props;
  const stepName = STEPS_ARRAY[step];
  return (
    <TextInput
      key={step}
      name={STEPS_ARRAY[step]}
      label={<T id={`NewLoanForm.${stepName}Label`} />}
      value={props[stepName]}
      type={TextFieldValueTypes[stepName]}
      id={Object.values(STEPS)[step]}
      autoFocus
      onChange={handleChange}
      className="new-loan-form-textfield"
    />
  );
};

export default NewLoanFormTextFields;
