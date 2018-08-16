// @flow
import React from 'react';
import T from 'core/components/Translation';
import { STEPS_ARRAY, STEPS } from './NewLoanFormContainer';
import TextInput from '../../../../core/components/TextInput';

const TextFieldValueTypes = ['text', 'money', 'money', 'money'];

type NewLoanFormTextFieldsProps = {
  step: Number,
  handleChange: Function,
};

const NewLoanFormTextFields = (props: NewLoanFormTextFieldsProps) => {
  const { step, handleChange } = props;
  return (
    <TextInput
      key={step}
      name={STEPS_ARRAY[step]}
      label={<T id={`NewLoanForm.${STEPS_ARRAY[step]}Label`} />}
      value={props[STEPS_ARRAY[step]]}
      type={TextFieldValueTypes[step]}
      id={Object.values(STEPS)[step]}
      autoFocus
      onChange={handleChange}
      className="new-loan-form-textfield"
    />
  );
};

export default NewLoanFormTextFields;
