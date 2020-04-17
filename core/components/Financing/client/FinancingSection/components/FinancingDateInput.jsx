import React from 'react';
import { connectField } from 'uniforms';

import DateField from '../../../../DateField';

export const FinancingInput = props => {
  const { value, disabled, formRef, structure, name } = props;

  const dbValue = structure[name];

  return (
    <DateField
      value={value}
      onBlur={() => {
        if (formRef && formRef.current) {
          if (dbValue !== value) {
            // Small optimization, only submit onBlur if the value has changed
            formRef.current.submit();
          }
        }
      }}
      disabled={disabled}
      margin="dense"
      label=" "
      shrink
      labelWidth={0}
    />
  );
};

export default connectField(FinancingInput);
