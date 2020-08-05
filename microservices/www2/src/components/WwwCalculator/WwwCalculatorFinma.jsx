import React from 'react';

import PercentWithStatus from 'core/components/PercentWithStatus';
import Recap2 from 'core/components/Recap2';
import T from 'core/components/Translation/FormattedMessage';

import { useWwwCalculator } from './WwwCalculatorState';

const capPercent = value => Math.min(Math.max(value, 0), 9.99);

const WwwCalculatorFinma = () => {
  const [state] = useWwwCalculator();
  const {
    purchaseType,
    borrowRatio,
    borrowRatioStatus: { status: borrowStatus },
    incomeRatio,
    incomeRatioStatus: { status: incomeStatus },
    hideFinma,
  } = state;

  if (hideFinma) {
    return null;
  }

  const finmaArray = [
    { label: <T id="WwwCalculatorFinma.title" />, title: true },
    {
      label: <T id="WwwCalculatorRecap.borrowRule" values={{ purchaseType }} />,
      value: (
        <PercentWithStatus
          value={capPercent(borrowRatio)}
          status={borrowStatus}
        />
      ),
    },
    {
      label: <T id="WwwCalculatorRecap.incomeRule" />,
      value: (
        <PercentWithStatus
          value={capPercent(incomeRatio)}
          status={incomeStatus}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex-col center-align animated fadeIn">
        <Recap2 array={finmaArray} />
      </div>
    </>
  );
};

export default WwwCalculatorFinma;
