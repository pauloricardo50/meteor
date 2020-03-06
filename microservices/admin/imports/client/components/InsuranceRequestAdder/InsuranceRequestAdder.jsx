import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Icon from 'core/components/Icon';
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
      buttonProps={{
        label: 'Dossier assurance',
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
        className: 'ml-8',
      }}
    />
  );
};

export default InsuranceRequestAdderContainer(InsuranceRequestAdder);
