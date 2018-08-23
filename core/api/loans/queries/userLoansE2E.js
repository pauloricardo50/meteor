import Loans from '../loans';
import { LOAN_QUERIES, AUCTION_STATUS } from '../loanConstants';
import { loanBaseFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.USER_LOANS_E2E, {
  $filter({ filters, params: { userId, unowned, step, auction } }) {
    filters.userId = userId;

    if (unowned) {
      filters.userId = { $exists: false };
    }

    if (step) {
      filters['logic.step'] = step;
    }

    if (Object.values(AUCTION_STATUS).includes(auction)) {
      filters['logic.auction.status'] = auction;
    }
  },
  ...loanBaseFragment,
  $options: { sort: { createdAt: -1 } },
});
