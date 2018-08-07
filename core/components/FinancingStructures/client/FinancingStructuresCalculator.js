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
    }),
  }),

  getBorrowRatio(data) {
    return {
      propertyValue: getProperty(data).value,
      loan: data.structure.wantedLoan,
      amortizationRate: Calc.getAmortizationRate(getAmortizationRateMapper(data)),
    };
  },

  getAmortizationRate: getAmortizationRateMapper,

  getInterestsWithTranches: ({
    structure: { loanTranches, offerId },
    offers,
  }) => {
    const interestRates = offerId && offers.find(({ _id }) => _id === offerId);

    return {
      tranches: loanTranches,
      interestRates,
    };
  },

  getIndirectAmortizationDeduction: (data) => {
    const {
      structure: { wantedLoan, propertyWork },
    } = data;
    return {
      loanValue: wantedLoan,
      amortizationRateRelativeToLoan: Calc.getAmortizationRateRelativeToLoan({
        borrowRatio: wantedLoan / (getProperty(data).value + propertyWork),
      }),
    };
  },

  getSecondPillarWithdrawalTax: ({
    structure: { secondPillarWithdrawal },
  }) => ({ secondPillarWithdrawal }),

  getEffectiveLoan: ({
    structure: { wantedLoan, secondPillarPledged, thirdPillarPledged },
  }) => ({
    loanValue: wantedLoan,
    pledgedValue: secondPillarPledged + thirdPillarPledged,
  }),
};

const argumentMapperMiddleware = makeArgumentMapper(argumentMappings);

export default new FinanceCalculator({
  middlewareObject: argumentMapperMiddleware,
});
