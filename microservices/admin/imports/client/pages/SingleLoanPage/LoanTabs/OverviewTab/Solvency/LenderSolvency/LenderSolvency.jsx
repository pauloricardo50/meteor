import React from 'react';

import DefaultCalculator, { Calculator } from 'core/utils/Calculator';
import { Money, Percent } from 'core/components/Translation';

const LenderSolvency = ({
  organisation: { lenderRules },
  loan,
  residenceType,
  canton,
}) => {
  const loanObject = DefaultCalculator.createLoanObject({
    residenceType,
    borrowers: loan.borrowers,
    canton,
  });
  const calc = new Calculator({ loan: loanObject, lenderRules });
  const totalIncome = calc.getTotalIncome({ loan });
  const maxPropertyValue = calc.getMaxPropertyValueWithoutBorrowRatio({
    borrowers: loan.borrowers,
    residenceType,
    canton,
  });

  return (
    <div className="lender-solvency">
      <div>
        <h3>Capacité d'achat max</h3>
        <div>
          <h4>Prix d'achat</h4>
          <Money value={maxPropertyValue && maxPropertyValue.propertyValue} />
        </div>
        <div>
          <h4>Taux d'avance</h4>
          <Percent value={maxPropertyValue && maxPropertyValue.borrowRatio} />
        </div>
      </div>

      <div>
        <h3>Revenus Considérés</h3>
        <Money value={totalIncome} />
      </div>
    </div>
  );
};

export default LenderSolvency;
