import Loans from '.';
import { LOAN_QUERIES } from './loanConstants';
import { adminLoan, userLoan, loanBase } from '../fragments';
import { formatLoanWithDocuments } from '../../utils/loanFunctions';
import { createSearchFilters } from '../helpers/mongoHelpers';

export const adminLoans = Loans.createQuery(
  LOAN_QUERIES.ADMIN_LOANS,
  {
    ...adminLoan({ withSort: true }),
    $options: { sort: { createdAt: -1 } },
  },
  { scoped: true },
);

export const anonymousLoan = Loans.createQuery(
  LOAN_QUERIES.ANONYMOUS_LOAN,
  userLoan(),
  {
    scoped: true,
  },
);

// This query can be used on the server to get a complete loan, just like on the client
export const fullLoan = Loans.createQuery(LOAN_QUERIES.FULL_LOAN, {
  ...adminLoan({ withSort: true }),
  $postFilter(loans = []) {
    return loans.map(formatLoanWithDocuments);
  },
});

export const loanSearch = Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(
      filters,
      createSearchFilters(['name', '_id', 'customName'], searchQuery),
    );
  },
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  step: 1,
  $options: { sort: { createdAt: -1 }, limit: 5 },
});

// Sort this query properly so that the merge on the client succeeds
export const proLoans = Loans.createQuery(LOAN_QUERIES.PRO_LOANS, () => {});

export const proPromotionLoans = Loans.createQuery(
  LOAN_QUERIES.PRO_PROMOTION_LOANS,
  () => {},
);

export const proPropertyLoans = Loans.createQuery(
  LOAN_QUERIES.PRO_PROPERTY_LOANS,
  () => {},
);

export const proReferredByLoans = Loans.createQuery(
  LOAN_QUERIES.PRO_REFERRED_BY_LOANS,
  () => {},
);

export const userLoans = Loans.createQuery(
  LOAN_QUERIES.USER_LOANS,
  userLoan({ withSort: true, withFilteredPromotions: true }),
  { scoped: true },
);

export const userLoansE2E = Loans.createQuery(LOAN_QUERIES.USER_LOANS_E2E, {
  $filter({ filters, params: { userId, unowned, step } }) {
    filters.userId = userId;

    if (unowned) {
      filters.userId = { $exists: false };
    }

    if (step) {
      filters.step = step;
    }
  },
  ...loanBase(),
  $options: { sort: { createdAt: -1 } },
});
