// @flow

// Map loan onto FinanceCalculator

import Calc from '../FinanceCalculator';
import { makeArgumentMapper } from '../MiddlewareManager';
import Selector from './Selector';

const argumentMappings = {
  getIndirectAmortizationDeduction: (data) => {
    const {
      loan: {
        structure: { wantedLoan, propertyWork },
      },
    } = data;
    return {
      loanValue: wantedLoan,
      amortizationRateRelativeToLoan: Calc.getAmortizationRateRelativeToLoanBase({
        borrowRatio:
          wantedLoan / (Selector.selectPropertyValue(data) + propertyWork),
      }),
    };
  },
};

export const financeCalculatorArgumentMapper = makeArgumentMapper(argumentMappings);

export const borrowerExtractorMiddleware = () => next => params =>
  (params && params.loan
    ? next({ ...params, borrowers: params.loan.borrowers })
    : next(params));
