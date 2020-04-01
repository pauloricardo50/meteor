import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button';
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
    renderAdditionalActions={({ closeDialog, setDisableActions, disabled }) => (
      <Button
        onClick={() => {
          setDisableActions(true);
          removeInsuranceProduct()
            .then(closeDialog)
            .finally(() => setDisableActions(false));
        }}
        error
        disabled={disabled}
      >
        Supprimer
      </Button>
    )}
  />
);

export default InsuranceProductForm(InsuranceProductModifier);
