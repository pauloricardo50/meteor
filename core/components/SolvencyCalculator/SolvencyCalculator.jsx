// @flow
import React from 'react';

import SolvencyCalculatorContainer, {
  STATE,
} from './SolvencyCalculatorContainer';
import SolvencyCalculatorEmptyState from './SolvencyCalculatorEmptyState';
import SolvencyCalculatorResults from './SolvencyCalculatorResults';

type SolvencyCalculatorProps = {};

const renderState = (props) => {
  const { state } = props;
  if (state !== STATE.DONE) {
    return <SolvencyCalculatorEmptyState {...props} />;
  }

  return <SolvencyCalculatorResults {...props} />;
};

const SolvencyCalculator = (props: SolvencyCalculatorProps) => (
  <div className="flex-row center">
    <div className="card1 solvency-calculator">{renderState(props)}</div>
  </div>
);

export default SolvencyCalculatorContainer(SolvencyCalculator);
