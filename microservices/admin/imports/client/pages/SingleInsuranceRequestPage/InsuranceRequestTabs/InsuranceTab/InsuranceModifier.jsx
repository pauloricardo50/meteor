import React from 'react';
import AutoForm from 'core/components/AutoForm2/AutoForm';
import InsuranceForm from './InsuranceForm';

const InsuranceModifier = ({
  schema,
  modifyInsurance,
  loading,
  model,
  ...props
}) => {
  if (loading) {
    return null;
  }

  return (
    <AutoForm
      schema={schema}
      model={model}
      onSubmit={modifyInsurance}
      title="Modifier assurance"
      {...props}
    />
  );
};

export default InsuranceForm(InsuranceModifier);
