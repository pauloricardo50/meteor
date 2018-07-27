// @flow
import { averageRates } from 'core/components/InterestRatesTable/interestRates';
import Calc, { FinanceCalculator } from 'core/utils/FinanceCalculator';
import { makeArgumentMapper } from 'core/utils/MiddlewareManager';
import { makeSelectPropertyValue } from '../../../redux/financingStructures';

const argumentMappings = {
  getBorrowRatio: ({
    structure: { id, wantedLoan },
    ...financingStructures
  }) => ({
    propertyValue: makeSelectPropertyValue(id)({ financingStructures }),
    loan: wantedLoan,
  }),
  getAmortizationRate: ({
    structure: { id, wantedLoan, propertyWork },
    ...financingStructures
  }) => ({
    borrowRatio:
        wantedLoan
        / (makeSelectPropertyValue(id)({ financingStructures }) + propertyWork),
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
    structure: { id, wantedLoan, propertyWork },
    ...financingStructures
  }) => ({
    loanValue: wantedLoan,
    amortizationRateRelativeToLoan: Calc.getAmortizationRateRelativeToLoan({
      borrowRatio:
        wantedLoan
        / (makeSelectPropertyValue(id)({ financingStructures }) + propertyWork),
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
