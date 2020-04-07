import React from 'react';

import { insuranceRequestRemove } from 'core/api/insuranceRequests/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';

const InsuranceRequestRemover = ({ insuranceRequestId }) => (
  <ConfirmMethod
    method={() => insuranceRequestRemove.run({ insuranceRequestId })}
    label="Supprimer le dossier"
    buttonProps={{
      error: true,
      outlined: true,
      className: 'insurance-request-remover',
    }}
    title="Supprimer le dossier"
    description="Êtes-vous sûr ? Supprimera toutes les assurances ainsi que tous les documents."
  />
);

export default InsuranceRequestRemover;
