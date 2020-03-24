import React from 'react';

import Icon from 'core/components/Icon';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import InsuranceForm from './InsuranceForm';

const InsuranceAdder = ({ schema, insertInsurance, loading, layout }) => {
  if (loading) {
    return null;
  }

  return (
    <AutoFormDialog
      schema={schema}
      onSubmit={insertInsurance}
      title="Nouvelle assurance"
      buttonProps={{
        fab: true,
        primary: true,
        label: '',
        icon: <Icon type="add" />,
        className: 'ml-8',
        size: 'small',
        tooltip: 'Ajouter une assurance',
      }}
      layout={layout}
    />
  );
};

export default InsuranceForm(InsuranceAdder);
