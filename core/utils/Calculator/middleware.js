// @flow

// Map loan onto FinanceCalculator

import Calc from '../FinanceCalculator';
import { makeArgumentMapper } from '../MiddlewareManager';
import Selector from './Selector';

const argumentMappings = {
  getBorrowRatio: data => ({
    propertyValue: Selector.selectPropertyValue(data),
    loan: data.loan.structure.wantedLoan,
  }),

  getAmortizationRate: (data) => {
    const {
      loan: {
        structure: { wantedLoan, propertyWork },
      },
    } = data;
    return {
      borrowRatio:
        wantedLoan / (Selector.selectPropertyValue(data) + propertyWork),
    };
  },

  getIndirectAmortizationDeduction: (data) => {
    const {
      loan: {
        structure: { wantedLoan, propertyWork },
      },
    } = data;
    return {
      loanValue: wantedLoan,
      amortizationRateRelativeToLoan: Calc.getAmortizationRateRelativeToLoan({
        borrowRatio:
          wantedLoan / (Selector.selectPropertyValue(data) + propertyWork),
      }),
    };
  },

  getSecondPillarWithdrawalTax: ({
    loan: {
      structure: { secondPillarWithdrawal },
    },
  }) => ({ secondPillarWithdrawal }),

  getEffectiveLoan: ({
    loan: {
      structure: { wantedLoan, secondPillarPledged, thirdPillarPledged },
    },
  }) => ({
    loanValue: wantedLoan,
    pledgedValue: secondPillarPledged + thirdPillarPledged,
  }),
};

export const financeCalculatorArgumentMapper = makeArgumentMapper(argumentMappings);
