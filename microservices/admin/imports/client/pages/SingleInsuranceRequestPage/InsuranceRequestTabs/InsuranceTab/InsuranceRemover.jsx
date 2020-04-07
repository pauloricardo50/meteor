import React from 'react';
import { useHistory } from 'react-router-dom';

import { insuranceRemove } from 'core/api/insurances/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../../startup/client/adminRoutes';

const InsuranceRemover = ({ insuranceId, insuranceRequestId }) => {
  const history = useHistory();
  return (
    <ConfirmMethod
      method={() =>
        insuranceRemove.run({ insuranceId }).then(() =>
          history.push(
            createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
              insuranceRequestId,
              tabId: 'overview',
            }),
          ),
        )
      }
      label="Supprimer l'assurance"
      buttonProps={{
        error: true,
        outlined: true,
        className: 'insurance-remover',
      }}
      title="Supprimer l'assurance"
      description="Êtes-vous sûr ? Supprimera tous les revenus attendus ainsi que les documents."
    />
  );
};

export default InsuranceRemover;
