import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';

import InsuranceProductForm from './InsuranceProductForm';

const InsuranceProductModifier = ({
  schema,
  insuranceProduct,
  updateInsuranceProduct,
  removeInsuranceProduct,
  organisationName,
  open,
  setOpen,
}) => (
  <AutoFormDialog
    schema={schema}
    model={insuranceProduct}
    onSubmit={updateInsuranceProduct}
    title="Modifier produit assurance"
    description={`Modifier le produit assurance de ${organisationName}`}
    open={open}
    setOpen={setOpen}
    noButton
    onDelete={() => removeInsuranceProduct()}
  />
);

export default InsuranceProductForm(InsuranceProductModifier);
