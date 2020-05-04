import React from 'react';

import { RESIDENCE_TYPE } from '../../../../api/properties/propertyConstants';
import {
  AMORTIZATION_YEARS,
  AMORTIZATION_YEARS_INVESTMENT,
} from '../../../../config/financeConstants';
import T from '../../../Translation';

const getDescriptionId = ({ loan, duration, offer }) => {
  if (offer) {
    return 'FinancingAmortizationDuration.withOffer';
  }

  const { residenceType } = loan;

  if (
    residenceType === RESIDENCE_TYPE.INVESTMENT &&
    duration === AMORTIZATION_YEARS_INVESTMENT
  ) {
    return 'FinancingAmortizationDuration.investment';
  }

  if (duration < AMORTIZATION_YEARS) {
    return 'FinancingAmortizationDuration.closeToRetirement';
  }

  return 'FinancingAmortizationDuration.default';
};

const FinancingAmortizationDuration = ({ loan, structureId, Calculator }) => {
  const duration = Calculator.getAmortizationYears({ loan, structureId });
  const offer = Calculator.selectOffer({ loan, structureId });

  return (
    <div className="amortizationDuration" style={{ padding: '8px 0' }}>
      <b className="text-center">
        <T
          id="FinancingAmortizationDuration.years"
          values={{ years: duration }}
        />
      </b>
      <span className="secondary text-center">
        <T
          id={getDescriptionId({
            loan,
            duration,
            offer,
          })}
          values={{ organisationName: offer?.organisation.name }}
        />
      </span>
    </div>
  );
};

export default FinancingAmortizationDuration;
