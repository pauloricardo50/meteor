// @flow
import React from 'react';

import ProgressCircle from '../ProgressCircle';

type LoanProgressProps = {
  loanProgress: Object,
};

const getPercent = ({ valid, required }) => {
  if (valid === 0 || required === 0) {
    return 0;
  }

  return valid / required;
};

const getRatio = ({ valid, required }) => ({ value: valid, target: required });

const LoanProgress = ({
  loanProgress: { info, documents },
}: LoanProgressProps) => (
  <div className="promotion-progress">
    <ProgressCircle
      percent={getPercent(info)}
      ratio={getRatio(info)}
      options={{
        squareSize: 24,
        strokeWidth: 5,
        animated: true,
        withRatio: true,
        tooltipPrefix: 'Informations:',
      }}
    />
    <ProgressCircle
      percent={getPercent(documents)}
      ratio={getRatio(documents)}
      options={{
        squareSize: 24,
        strokeWidth: 5,
        animated: true,
        withRatio: true,
        tooltipPrefix: 'Documents:',
      }}
    />
  </div>
);

export default LoanProgress;
