import Calculator from '../../../utils/Calculator';
import Calc, { FinanceCalculator } from '../../../utils/FinanceCalculator';
import { makeArgumentMapper } from '../../../utils/MiddlewareManager/index';

export const getProperty = ({ loan, structureId }) =>
  Calculator.selectProperty({ loan, structureId });

export const getOffer = ({ structureId, loan }) =>
  Calculator.selectOffer({ loan, structureId });

export const getAmortizationRateMapper = data => {
  const {
    structure: { wantedLoan, propertyWork },
  } = data;
  return {
    borrowRatio:
      wantedLoan / (Calculator.selectPropertyValue(data) + propertyWork),
  };
};

export const getInterestRates = ({ structureId, loan, offer }) => {
  const { offerId } = Calculator.selectStructure({
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

  return interestRates;
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

  getLoanFromBorrowRatio: (borrowRatio, data) => {
    const propertyValue =
      Calculator.selectPropertyValue(data) + data.structure.propertyWork;
    return { propertyValue, borrowRatio };
  },

  getAmortizationRateBase: getAmortizationRateMapper,

  getInterestsWithTranches: data => {
    const { loan, structureId } = data;
    const { loanTranches } = Calculator.selectStructure({
      loan,
      structureId,
    });

    return { tranches: loanTranches, interestRates: getInterestRates(data) };
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
