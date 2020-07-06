import React from 'react';
import { useHistory } from 'react-router-dom';

import { INSURANCE_POTENTIAL } from 'core/api/loans/loanConstants';
import {
  notifyInsuranceTeamForPotential,
  updateInsurancePotential,
} from 'core/api/loans/methodDefinitions';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import InsuranceRequestAdder from '../InsuranceRequestAdder';

const InsurancePotentialActions = ({ loan }) => {
  const { _id: loanId, insurancePotential, user } = loan;
  const history = useHistory();

  if (
    [INSURANCE_POTENTIAL.NONE, INSURANCE_POTENTIAL.VALIDATED].includes(
      insurancePotential,
    )
  ) {
    return null;
  }

  return (
    <div className="flex mt-16 sa">
      {!insurancePotential && (
        <ConfirmMethod
          method={() => notifyInsuranceTeamForPotential.run({ loanId })}
          buttonProps={{ primary: true, raised: true }}
          label="Valider et notifier la team prévoyance"
          description="Une tâche va être créée pour la team prévoyance"
        />
      )}
      {insurancePotential === INSURANCE_POTENTIAL.NOTIFIED && (
        <InsuranceRequestAdder
          loan={loan}
          user={user}
          withKeepAssigneesCheckbox
          onSuccess={insuranceRequestId =>
            updateInsurancePotential
              .run({
                loanId,
                insurancePotential: INSURANCE_POTENTIAL.VALIDATED,
              })
              .then(() =>
                history.push(
                  createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
                    insuranceRequestId,
                  }),
                ),
              )
          }
        />
      )}
      {[undefined, INSURANCE_POTENTIAL.NOTIFIED].includes(
        insurancePotential,
      ) && (
        <ConfirmMethod
          method={() =>
            updateInsurancePotential.run({
              loanId,
              insurancePotential: INSURANCE_POTENTIAL.NONE,
            })
          }
          buttonProps={{ error: true, outlined: true }}
          label="Pas de potentiel"
        />
      )}
    </div>
  );
};

export default InsurancePotentialActions;
