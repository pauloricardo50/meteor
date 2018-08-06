// @flow
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';

export const getProperty = ({ structure: { propertyId }, properties }) =>
  properties.find(({ _id }) => _id === propertyId);

const argumentMappings = {
  getBorrowRatio: data => ({
    propertyValue: getProperty(data).value,
    loan: data.structure.wantedLoan,
  }),
  getAmortizationRate: (data) => {
    const {
      structure: { wantedLoan, propertyWork },
    } = data;
    return {
      borrowRatio: wantedLoan / (getProperty(data).value + propertyWork),
    };
  },
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
