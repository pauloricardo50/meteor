import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Icon from 'core/components/Icon';
import InsuranceProductForm from './InsuranceProductForm';

const InsuranceProductAdder = ({
  schema,
  insertInsuranceProduct,
  organisationName,
}) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertInsuranceProduct}
    title="Nouveau produit assurance"
    description={`Ajouter un nouveau produit assurance à ${organisationName}`}
    buttonProps={{
      label: 'Produit',
      icon: <Icon type="add" />,
      raised: true,
      primary: true,
    }}
  />
);

export default InsuranceProductForm(InsuranceProductAdder);
