import './WwwCalculator.scss';

import React, { useEffect } from 'react';

import meteorClient from '../../utils/meteorClient';
import WwwCalculatorChart from './WwwCalculatorChart';
import { ACTIONS } from './wwwCalculatorConstants';
import WwwCalculatorForm from './WwwCalculatorForm';
import WwwCalculatorPurchaseType from './WwwCalculatorPurchaseType';
import WwwCalculatorRecap from './WwwCalculatorRecap';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculator = () => {
  const [_, dispatch] = useWwwCalculator();

  useEffect(() => {
    const getCurrentRates = async () => {
      const response = await meteorClient.call(
        'named_query_CURRENT_INTEREST_RATES',
      );
      if (response?.rates) {
        dispatch({
          type: ACTIONS.SET,
          payload: { interestRates: response.rates },
        });
        dispatch({
          type: ACTIONS.SET,
          payload: {
            interestRate: response.rates.find(
              ({ type }) => type === 'interest10',
            ).rateLow,
          },
        });
      }
    };
    getCurrentRates();
  }, []);

  return (
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
  );
};

export default WwwCalculator;
