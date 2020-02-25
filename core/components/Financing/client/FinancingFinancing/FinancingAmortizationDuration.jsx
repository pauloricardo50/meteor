import React from 'react';

import T from '../../../Translation';

const FinancingAmortizationDuration = ({ loan, structureId, Calculator }) => {
  const duration = Calculator.getAmortizationYears({ loan, structureId });

  return (
    <div className="amortizationDuration" style={{ padding: '8px 0' }}>
      <b className="text-center">
        <T
          id="FinancingAmortizationDuration.years"
          values={{ years: duration }}
        />
      </b>
    </div>
  );
};

export default FinancingAmortizationDuration;
