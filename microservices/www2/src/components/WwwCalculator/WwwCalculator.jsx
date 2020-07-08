import './WwwCalculator.scss';

import React from 'react';

import WwwCalculatorChart from './WwwCalculatorChart';
import WwwCalculatorForm from './WwwCalculatorForm';
import WwwCalculatorPurchaseType from './WwwCalculatorPurchaseType';
import WwwCalculatorRecap from './WwwCalculatorRecap';
import { WwwCalculatorProvider } from './WwwCalculatorState';
import WwwCalculatorStatus from './WwwCalculatorStatus';

const WwwCalculator = () => (
  <WwwCalculatorProvider>
    <div className="www-calculator">
      <div className="www-calculator-top">
        <div className="flex-col">
          <WwwCalculatorPurchaseType />
          <WwwCalculatorStatus />
        </div>

        <WwwCalculatorForm />
      </div>

      <div className="www-calculator-bottom">
        <WwwCalculatorRecap />
        <WwwCalculatorChart />
      </div>
    </div>
  </WwwCalculatorProvider>
);

export default WwwCalculator;
