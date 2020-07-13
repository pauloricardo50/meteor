import React from 'react';

import PercentWithStatus from 'core/components/PercentWithStatus';
import Recap2 from 'core/components/Recap2';
import T from 'core/components/Translation/FormattedMessage';

import { PURCHASE_TYPE } from './wwwCalculatorConstants';
import {
  getBorrowRatio,
  getFinmaYearlyCost,
  getIncomeRatio,
  getRefinancingBorrowRatio,
  validateBorrowRatio,
  validateIncomeRatio,
} from './wwwCalculatorMath';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorFinma = () => {
  const [state] = useWwwCalculator();
  const { purchaseType, property, fortune, wantedLoan, salary } = state;
  const borrowRatio =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getBorrowRatio(property.value, fortune.value)
      : getRefinancingBorrowRatio(property.value, wantedLoan.value);
  const incomeRatio = getIncomeRatio(
    salary.value,
    getFinmaYearlyCost(property.value, fortune.value, wantedLoan.value).total,
  );
  const { status: borrowStatus } = validateBorrowRatio(borrowRatio);
  const { status: incomeStatus } = validateIncomeRatio(incomeRatio);

  const finmaArray = [
    {
      label: <T id="WwwCalculatorRecap.borrowRule" values={{ purchaseType }} />,
      value: <PercentWithStatus value={borrowRatio} status={borrowStatus} />,
    },
    {
      label: <T id="WwwCalculatorRecap.incomeRule" />,
      value: <PercentWithStatus value={incomeRatio} status={incomeStatus} />,
    },
  ];

  return (
    <>
      <h3 style={{ marginTop: 40 }}>
        <T id="WwwCalculatorFinma.title" />
      </h3>

      <div className="flex-col center-align">
        <Recap2 array={finmaArray} />
      </div>
    </>
  );
};

export default WwwCalculatorFinma;
