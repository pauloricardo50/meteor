import React from 'react';

import PercentWithStatus from 'core/components/PercentWithStatus';
import Recap2 from 'core/components/Recap2';
import T from 'core/components/Translation/FormattedMessage';

import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorFinma = () => {
  const [state] = useWwwCalculator();
  const {
    purchaseType,
    borrowRatio,
    borrowRatioStatus: { status: incomeStatus },
    incomeRatio,
    incomeRatioStatus: { status: borrowStatus },
  } = state;

  const finmaArray = [
    { label: <T id="WwwCalculatorFinma.title" />, title: true },
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
      <div className="flex-col center-align">
        <Recap2 array={finmaArray} />
      </div>
    </>
  );
};

export default WwwCalculatorFinma;
