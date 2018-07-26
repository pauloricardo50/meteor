// @flow
import { averageRates } from 'core/components/InterestRatesTable/interestRates';
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';

const argumentMappings = {
  getBorrowRatio: ({ structure: { propertyValue, wantedLoan } }) => ({
    propertyValue,
    loan: wantedLoan,
  }),
  getAmortizationRate: ({
    structure: { propertyValue, wantedLoan, propertyWork },
  }) => ({
    borrowRatio: wantedLoan / (propertyValue + propertyWork),
  }),
  getInterestsWithTranches: ({
    structure: { loanTranches, offerId },
    offers,
  }) => {
    const interestRates = offerId
      ? offers.find(({ _id }) => _id === offerId)
      : averageRates;

    return {
      tranches: loanTranches,
      interestRates,
    };
  },
  getIndirectAmortizationDeduction: ({
    structure: { propertyValue, wantedLoan, propertyWork },
  }) => ({
    loanValue: wantedLoan,
    amortizationRateRelativeToLoan: Calc.getAmortizationRateRelativeToLoan({
      borrowRatio: wantedLoan / (propertyValue + propertyWork),
    }),
  }),

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
