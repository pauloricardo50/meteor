import React from 'react';
import Icon from 'core/components/Icon';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import InsuranceForm from './InsuranceForm';

const InsuranceAdder = ({ schema, insertInsurance, loading }) => {
  if (loading) {
    return null;
  }

  return (
    <AutoFormDialog
      schema={schema}
      onSubmit={insertInsurance}
      title="Nouvelle assurance"
      buttonProps={{
        label: 'Assurance',
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
        className: 'ml-8',
      }}
    />
  );
};

export default InsuranceForm(InsuranceAdder);
