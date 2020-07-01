import React from 'react';

import { INSURANCE_POTENTIAL } from 'core/api/loans/loanConstants';
import colors from 'core/config/colors';

const InsurancePotentialStatus = ({ insurancePotential }) => {
  let status;

  switch (insurancePotential) {
    case INSURANCE_POTENTIAL.TRANSMITTED:
      status = (
        <span
          className="status-label ml-8"
          style={{ backgroundColor: colors.primary }}
        >
          Évaluation en cours
        </span>
      );
      break;
    case INSURANCE_POTENTIAL.INSUFFICIENT:
      status = (
        <span
          className="status-label ml-8"
          style={{ backgroundColor: colors.error }}
        >
          Insuffisant
        </span>
      );
      break;
    case INSURANCE_POTENTIAL.VALIDATED:
      status = (
        <span
          className="status-label ml-8"
          style={{ backgroundColor: colors.success }}
        >
          Validé
        </span>
      );
      break;
    default:
      status = (
        <span
          className="status-label ml-8"
          style={{ backgroundColor: colors.warning }}
        >
          À transmettre
        </span>
      );
  }
  return (
    <h4 className="flex center mt-0 mb-0">
      Potentiel prévoyance du dossier identifié {status}
    </h4>
  );
};

export default InsurancePotentialStatus;
