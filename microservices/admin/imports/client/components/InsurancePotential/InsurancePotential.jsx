import React from 'react';

import { INSURANCE_POTENTIAL } from 'core/api/loans/loanConstants';
import colors from 'core/config/colors';
import Calculator from 'core/utils/Calculator';

import BorrowerInsurancePotential from './BorrowerInsurancePotential';
import InsurancePotentialActions from './InsurancePotentialActions';
import InsurancePotentialStatus from './InsurancePotentialStatus';

const InsurancePotential = ({ loan, hideWhenCompleted = false }) => {
  const { insurancePotential, borrowers, insuranceRequests = [] } = loan;
  const borrowersInsurancePotential = Calculator.hasInsurancePotential({
    borrowers,
  });

  const hasAlreadyBeenChecked = [
    INSURANCE_POTENTIAL.VALIDATED,
    INSURANCE_POTENTIAL.NONE,
  ].includes(insurancePotential);

  const hasInsuranceRequest = !!insuranceRequests?.length;

  if ((hasAlreadyBeenChecked || hasInsuranceRequest) && hideWhenCompleted) {
    return null;
  }

  const hasPotential = Object.values(borrowersInsurancePotential).some(
    ({ hasPotential: borrowerHasPotential }) => !!borrowerHasPotential,
  );

  if (!hasPotential) {
    return null;
  }

  let border;

  if (!insurancePotential) {
    border = `1px solid ${colors.warning}`;
  } else if (insurancePotential === INSURANCE_POTENTIAL.NOTIFIED) {
    border = `1px solid ${colors.primary}`;
  }

  return (
    <div
      className="card1 flex-col mb-16 p-16"
      style={{ alignSelf: 'center', border }}
    >
      <InsurancePotentialStatus insurancePotential={insurancePotential} />
      {insurancePotential !== INSURANCE_POTENTIAL.VALIDATED && (
        <>
          <div className="flex mt-8 sa">
            {borrowers.map(borrower => (
              <BorrowerInsurancePotential
                key={borrower._id}
                borrower={borrower}
                potential={borrowersInsurancePotential[borrower._id]}
              />
            ))}
          </div>
          <InsurancePotentialActions
            loan={loan}
            borrowersInsurancePotential={borrowersInsurancePotential}
          />
        </>
      )}
    </div>
  );
};

export default InsurancePotential;
