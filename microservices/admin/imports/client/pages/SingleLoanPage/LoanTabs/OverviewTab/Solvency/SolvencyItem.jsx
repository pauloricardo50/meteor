// @flow
import React from 'react';

import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';
import { Money } from 'core/components/Translation';

type SolvencyItemProps = {};

const SolvencyItem = ({
  loan,
  canton,
  residenceType,
  maxBorrowRatio,
  organisations,
}: SolvencyItemProps) => {
  const defaultSolvency = Calculator.getMaxPropertyValueForLoan({
    loan,
    maxBorrowRatio,
    residenceType,
    canton,
  });
  const solvencies = organisations.map(({ lenderRules, logo, _id }) => {
    const loanObject = Calculator.createLoanObject({
      residenceType,
      borrowers: loan.borrowers,
      canton,
    });

    const calc = new CalculatorClass({ loan: loanObject, lenderRules });

    return {
      logo,
      _id,
      solvency: calc.getMaxPropertyValueForLoan({
        loan,
        maxBorrowRatio,
        residenceType,
        canton,
      }),
    };
  });

  const top3 = solvencies
    .sort(({ solvency: solvencyA }, { solvency: solvencyB }) =>
      solvencyB - solvencyA)
    .slice(0, 3);

  return (
    <div className="flex-col">
      <div className="flex">
        <img
          src="/img/logo_square_black.svg"
          alt=""
          style={{ width: 100, maxHeight: 50 }}
        />
        <Money value={defaultSolvency} />
      </div>
      {top3.map(({ solvency, logo }) => (
        <div key={organisations._id} className="flex">
          <img src={logo} alt="" style={{ width: 100, maxHeight: 50 }} />
          <Money value={solvency} />
        </div>
      ))}
    </div>
  );
};

export default SolvencyItem;
