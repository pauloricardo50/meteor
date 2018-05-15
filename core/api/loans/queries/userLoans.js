import Loans from '..';
import { LOAN_QUERIES, AUCTION_STATUS } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.USER_LOANS, {
  $filter({ filters, params: { userId, unowned, step, auction } }) {
    filters.userId = userId;

    if (unowned) {
      filters.userId = { $exists: false };
    }

    if (step) {
      filters['logic.step'] = step;
    }

    const auctionStatusKey = 'logic.auction.status';
    switch (auction) {
    case 'none':
      filters[auctionStatusKey] = AUCTION_STATUS.NONE;
      break;
    case 'started':
      filters[auctionStatusKey] = AUCTION_STATUS.STARTED;
      break;
    case 'ended':
      filters[auctionStatusKey] = AUCTION_STATUS.ENDED;
      break;
    default:
      break;
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  name: 1,
  logic: 1,
  general: 1,
  createdAt: 1,
  updatedAt: 1,
  property: {
    value: 1,
  },
  borrowers: {
    firstName: 1,
  },
});
