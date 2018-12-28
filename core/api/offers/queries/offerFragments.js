import { simpleUserFragment } from '../../users/queries/userFragments';
import { INTEREST_RATES } from '../../constants';

export const fullOfferFragment = {
  amortizationGoal: 1,
  amortizationYears: 1,
  conditions: 1,
  epotekFees: 1,
  feedback: 1,
  ...Object.values(INTEREST_RATES).reduce(
    (rates, rate) => ({ ...rates, [rate]: 1 }),
    {},
  ),
  fees: 1,
  lender: {
    loan: { _id: 1, name: 1 },
    contact: { _id: 1, name: 1 },
    organisation: { _id: 1, name: 1 },
  },
  loanId: 1,
  maxAmount: 1,
  organisation: 1,
  user: simpleUserFragment,
};
