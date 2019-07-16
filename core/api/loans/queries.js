import omit from 'lodash/omit';

import Loans from '.';
import { LOAN_QUERIES } from './loanConstants';
import { adminLoan, userLoan } from '../fragments';

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
  { ...omit(userLoan(), ['maxPropertyValue']), maxPropertyValueExists: 1 },
  { scoped: true },
);

// This query can be used on the server to get a complete loan, just like on the client
export const fullLoan = Loans.createQuery(LOAN_QUERIES.FULL_LOAN, {
  ...adminLoan({ withSort: true }),
});

export const loanSearch = Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
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
  {
    ...userLoan({ withSort: true, withFilteredPromotions: true }),
    maxPropertyValueExists: 1,
  },
  { scoped: true },
);
