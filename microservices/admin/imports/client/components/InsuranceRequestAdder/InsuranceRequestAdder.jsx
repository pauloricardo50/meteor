import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import InsuranceRequestAdderContainer from './InsuranceRequestAdderContainer';

const InsuranceRequestAdder = ({ schema, model, onSubmit, loading }) => {
  if (loading) {
    return null;
  }
  return (
    <AutoFormDialog
      schema={schema}
      model={model}
      onSubmit={onSubmit}
      title="Nouveau dossier assurance"
      buttonProps={{ label: 'Dossier assurance', raised: true, primary: true }}
    />
  );
};

export default InsuranceRequestAdderContainer(InsuranceRequestAdder);
