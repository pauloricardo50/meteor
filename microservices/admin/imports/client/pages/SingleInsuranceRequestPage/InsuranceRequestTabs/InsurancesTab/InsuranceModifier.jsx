import React from 'react';
import Icon from 'core/components/Icon';
import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
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
    <AutoFormDialog
      schema={schema}
      model={model}
      onSubmit={modifyInsurance}
      title="Modifier assurance"
      {...props}
    />
  );
};

export default InsuranceForm(InsuranceModifier);
