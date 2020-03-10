import React from 'react';
import Button from 'core/components/Button';
import { insuranceRequestUpdate } from 'core/api/insuranceRequests/methodDefinitions';
import { loanUpdate } from 'core/api/loans/methodDefinitions';

const InsuranceRequestAdderNameSetter = ({
  closeModal,
  insuranceRequestName,
  insuranceRequestId,
  loanName,
  loanId,
}) => (
  <div>
    <Button
      label={`Garder le numéro actuel ${insuranceRequestName}`}
      onClick={() =>
        loanUpdate
          .run({
            loanId,
            object: {
              name: insuranceRequestName
                .split('-')
                .slice(0, 2)
                .join('-'),
            },
          })
          .then(() => closeModal())
      }
      primary
      raised
    />
    <Button
      label={`Utiliser le numéro ${loanName}-A`}
      onClick={() =>
        insuranceRequestUpdate
          .run({
            insuranceRequestId,
            object: {
              name: `${loanName}-A`,
            },
          })
          .then(() => closeModal())
      }
      primary
      raised
      className="ml-8"
    />
  </div>
);

export default InsuranceRequestAdderNameSetter;
