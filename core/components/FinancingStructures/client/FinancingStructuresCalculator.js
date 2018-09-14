// @flow
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';
import { getPropertyValue } from './FinancingStructuresOwnFunds/ownFundsHelpers.js';

export const getProperty = ({ structure: { propertyId }, properties }) =>
  properties.find(({ _id }) => _id === propertyId);

export const getAmortizationRateMapper = (data) => {
  const {
    structure: { wantedLoan, propertyWork },
  } = data;
  return {
    borrowRatio: wantedLoan / (getPropertyValue(data) + propertyWork),
  };
};

const argumentMappings = {
  getIncomeRatio: data => ({
    monthlyIncome: BorrowerCalculator.getTotalIncome(data) / 12,
    monthlyPayment: Calc.getTheoreticalMonthly({
      propAndWork: getPropertyValue(data) + data.structure.propertyWork,
      loanValue: data.structure.wantedLoan,
      amortizationRate: Calc.getAmortizationRateBase(getAmortizationRateMapper(data)),
    }).total,
  }),

  getBorrowRatio: data => ({
    propertyValue: getPropertyValue(data) + data.structure.propertyWork,
    loan: data.structure.wantedLoan,
  }),

  getLoanFromBorrowRatio: (borrowRatio, data) => ({
    propertyValue: getPropertyValue(data) + data.structure.propertyWork,
    borrowRatio,
  }),

  getAmortizationRateBase: getAmortizationRateMapper,

  getInterestsWithTranches: ({
    structure: { loanTranches, offerId },
    offers,
  }) => {
    const interestRates = offerId && offers.find(({ _id }) => _id === offerId);

    return { tranches: loanTranches, interestRates };
  },

  getIndirectAmortizationDeduction: (data) => {
    const {
      structure: { wantedLoan, propertyWork },
    } = data;
    return {
      loanValue: wantedLoan,
      amortizationRate: Calc.amortizationRateBase({
        borrowRatio: wantedLoan / (getPropertyValue(data).value + propertyWork),
      }),
    };
  },

  getMinCash: data => ({
    propertyValue: getPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),

  getFeesBase: data => ({
    propertyValue: getPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
