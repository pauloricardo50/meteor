import React from 'react';

import { INSURANCE_POTENTIAL } from 'core/api/loans/loanConstants';
import colors from 'core/config/colors';

const statusConfig = {
  [INSURANCE_POTENTIAL.NOTIFIED]: {
    color: colors.primary,
    label: 'Évaluation en cours',
  },
  [INSURANCE_POTENTIAL.NONE]: { color: colors.error, label: 'Insuffisant' },
  [INSURANCE_POTENTIAL.VALIDATED]: { color: colors.success, label: 'Validé' },
  default: { color: colors.warning, label: 'À transmettre' },
};

const InsurancePotentialStatus = ({ insurancePotential }) => {
  const { color, label } = statusConfig[insurancePotential || 'default'];

  return (
    <h4 className="flex center mt-0 mb-0">
      Potentiel prévoyance du dossier identifié{' '}
      <span className="status-label ml-8" style={{ backgroundColor: color }}>
        {label}
      </span>
    </h4>
  );
};

export default InsurancePotentialStatus;
