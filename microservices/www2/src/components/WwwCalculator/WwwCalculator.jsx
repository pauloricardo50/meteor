import './WwwCalculator.scss';

import React from 'react';

import WwwCalculatorChart from './WwwCalculatorChart';
import WwwCalculatorForm from './WwwCalculatorForm';
import WwwCalculatorPurchaseType from './WwwCalculatorPurchaseType';
import WwwCalculatorRecap from './WwwCalculatorRecap';
import { WwwCalculatorProvider } from './WwwCalculatorState';

const WwwCalculator = () => (
  <WwwCalculatorProvider>
    <div className="www-calculator">
      <WwwCalculatorPurchaseType />
      <div className="www-calculator-top">
        <WwwCalculatorForm />
        <WwwCalculatorRecap />
      </div>

      <div className="www-calculator-bottom">
        <WwwCalculatorChart />
      </div>
    </div>
  </WwwCalculatorProvider>
);

export default WwwCalculator;
