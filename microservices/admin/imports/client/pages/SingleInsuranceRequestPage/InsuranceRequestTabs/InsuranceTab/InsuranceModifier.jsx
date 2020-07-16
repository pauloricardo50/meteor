import React from 'react';
import { compose, withProps } from 'recompose';

import AutoForm from 'core/components/AutoForm2/AutoForm';

import InsuranceForm from './InsuranceForm';

const InsuranceModifier = ({ schema, onSubmit, loading, model, ...props }) => {
  if (loading) {
    return null;
  }

  return (
    <AutoForm
      schema={schema}
      model={model}
      onSubmit={onSubmit}
      title="Modifier assurance"
      {...props}
    />
  );
};

export default compose(
  withProps(() => ({ type: 'update' })),
  InsuranceForm,
)(InsuranceModifier);
