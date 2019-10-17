// @flow
import React from 'react';

import ProgressCircle from '../ProgressCircle';

type LoanProgressProps = {
  loanProgress: Object,
};

const LoanProgress = ({
  loanProgress: { info, documents },
}: LoanProgressProps) => (
  <div className="promotion-progress">
    <ProgressCircle
      percent={info}
      options={{ squareSize: 24, strokeWidth: 5, animated: true }}
    />
    <ProgressCircle
      percent={documents}
      options={{ squareSize: 24, strokeWidth: 5, animated: true }}
    />
  </div>
);

export default LoanProgress;
