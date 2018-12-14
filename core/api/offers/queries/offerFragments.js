import { simpleUserFragment } from '../../users/queries/userFragments';
import { INTEREST_RATES } from '../../constants';

export const fullOfferFragment = {
  loanId: 1,
  user: simpleUserFragment,
  amortizationGoal: 1,
  amortizationYears: 1,
  maxAmount: 1,
  conditions: 1,
  fees: 1,
  epotekFees: 1,
  organisation: { name: 1, logo: 1 },
  ...Object.values(INTEREST_RATES).reduce(
    (rates, rate) => ({ ...rates, [rate]: 1 }),
    {},
  ),
  contact: { _id: 1, name: 1, feedback: 1 },
  // $options: { sort: { createdAt: 1 } },
};
