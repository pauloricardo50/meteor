import { simpleUserFragment } from '../../users/queries/userFragments';
import { INTEREST_RATES } from '../../constants';

export const fullOfferFragment = {
  loanId: 1,
  user: simpleUserFragment,
  amortization: 1,
  maxAmount: 1,
  conditions: 1,
  ...Object.values(INTEREST_RATES).reduce(
    (rates, rate) => ({ ...rates, [rate]: 1 }),
    {},
  ),
  // $options: { sort: { createdAt: 1 } },
};
