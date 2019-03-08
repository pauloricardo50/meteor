// @flow
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import Calculator from 'core/utils/Calculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';

export const getProperty = ({ loan, structureId }) =>
  Calculator.selectProperty({ loan, structureId });

export const getOffer = ({ structureId, loan }) =>
  Calculator.selectOffer({ loan, structureId });

export const getAmortizationRateMapper = (data) => {
  const {
    structure: { wantedLoan, propertyWork },
  } = data;
  return {
    borrowRatio:
      wantedLoan / (Calculator.selectPropertyValue(data) + propertyWork),
  };
};

const argumentMappings = {
  getIncomeRatio: data => ({
    monthlyIncome: Calculator.getTotalIncome(data) / 12,
    monthlyPayment: Calc.getTheoreticalMonthly({
      propAndWork:
        Calculator.selectPropertyValue(data) + data.structure.propertyWork,
      loanValue: data.structure.wantedLoan,
      amortizationRate: Calc.getAmortizationRate(data),
    }).total,
  }),

  getBorrowRatio: data => ({
    propertyValue:
      Calculator.selectPropertyValue(data) + data.structure.propertyWork,
    loan: data.structure.wantedLoan,
  }),

  getLoanFromBorrowRatio: (borrowRatio, data) => ({
    propertyValue:
      Calculator.selectPropertyValue(data) + data.structure.propertyWork,
    borrowRatio,
  }),

  getAmortizationRateBase: getAmortizationRateMapper,

  getInterestsWithTranches: ({ structureId, loan, offer }) => {
    const { loanTranches, offerId } = Calculator.selectStructure({
      loan,
      structureId,
    });
    let interestRates;
    if (offer) {
      interestRates = offer;
    } else if (offerId) {
      interestRates = Calculator.selectOffer({
        loan,
        structureId,
      });
    } else {
      interestRates = loan.currentInterestRates;
    }

    return { tranches: loanTranches, interestRates };
  },

  getMinCash: data => ({
    propertyValue: Calculator.selectPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),

  getFeesBase: data => ({
    propertyValue: Calculator.selectPropertyValue(data),
    propertyWork: data.structure.propertyWork,
    fees: data.structure.notaryFees,
  }),
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
