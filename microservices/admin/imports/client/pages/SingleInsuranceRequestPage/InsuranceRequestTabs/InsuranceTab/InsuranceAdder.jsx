import React from 'react';

import { INSURANCE_REQUEST_STATUS } from 'core/api/insuranceRequests/insuranceRequestConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Icon from 'core/components/Icon';

import InsuranceForm from './InsuranceForm';

const InsuranceAdder = ({
  schema,
  insertInsurance,
  loading,
  layout,
  insuranceRequest,
}) => {
  if (loading) {
    return null;
  }

  const { borrowers = [], status } = insuranceRequest;
  const hasBorrowers = !!borrowers.length;
  const statusAllowsToInsert = ![
    INSURANCE_REQUEST_STATUS.BILLING,
    INSURANCE_REQUEST_STATUS.FINALIZED,
  ].includes(status);

  const shouldDisable = !hasBorrowers || !statusAllowsToInsert;

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
        disabled: shouldDisable,
        tooltip: shouldDisable
          ? !hasBorrowers
            ? 'Vous devez ajouter des assurés pour insérer une assurance'
            : 'Vous ne pouvez pas insérer de nouvelle assurance lorsque le dossier est en Facturation ou Finalisé'
          : 'Ajouter une assurance',
      }}
      layout={layout}
    />
  );
};

export default InsuranceForm(InsuranceAdder);
