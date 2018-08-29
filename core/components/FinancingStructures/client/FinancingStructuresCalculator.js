// @flow
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';

export const getProperty = ({ structure: { propertyId }, properties }) =>
  properties.find(({ _id }) => _id === propertyId);

export const getAmortizationRateMapper = (data) => {
  const {
    structure: { wantedLoan, propertyWork },
  } = data;
  return {
    borrowRatio: wantedLoan / (getProperty(data).value + propertyWork),
  };
};

const argumentMappings = {
  getIncomeRatio: data => ({
    income: BorrowerCalculator.getTotalIncome(data),
    payment: Calc.getTheoreticalMonthly({
      propAndWork: getProperty(data).value + data.structure.propertyWork,
      loanValue: data.structure.wantedLoan,
      amortizationRate: Calc._getAmortizationRate(getAmortizationRateMapper(data)),
    }).total,
  }),

  getBorrowRatio: data => ({
    propertyValue: getProperty(data).value + data.structure.propertyWork,
    loan: data.structure.wantedLoan,
  }),

  getLoanFromBorrowRatio: (borrowRatio, data) => ({
    propertyValue: getProperty(data).value + data.structure.propertyWork,
    borrowRatio,
  }),

  _getAmortizationRate: getAmortizationRateMapper,

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
      amortizationRateRelativeToLoan: Calc._getAmortizationRateRelativeToLoan({
        borrowRatio: wantedLoan / (getProperty(data).value + propertyWork),
      }),
    };
  },

  getMinCash: data => ({
    propertyValue: getProperty(data).value,
    propertyWork: data.structure.propertyWork,
  }),
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
