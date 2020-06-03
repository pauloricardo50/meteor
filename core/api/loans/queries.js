import omit from 'lodash/omit';

import {
  proLoanWithRevenues,
  proLoans as proLoansFragments,
  userLoan,
} from '../fragments';
import { LOAN_QUERIES } from './loanConstants';
import Loans from '.';

export const anonymousLoan = Loans.createQuery(
  LOAN_QUERIES.ANONYMOUS_LOAN,
  { ...omit(userLoan(), ['maxPropertyValue']), maxPropertyValueExists: 1 },
  { scoped: true },
);

export const loanSearch = Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
  category: 1,
  name: 1,
  status: 1,
  $options: { sort: { createdAt: -1 }, limit: 5 },
});

export const proLoans2 = Loans.createQuery(
  `${LOAN_QUERIES.PRO_LOANS}`,
  proLoansFragments(),
);

export const proLoansAggregate = Loans.createQuery(
  LOAN_QUERIES.PRO_LOANS_AGGREGATE,
  proLoanWithRevenues(),
);

export const proPromotionLoans = Loans.createQuery(
  LOAN_QUERIES.PRO_PROMOTION_LOANS,
  () => {},
);

export const proPropertyLoans = Loans.createQuery(
  LOAN_QUERIES.PRO_PROPERTY_LOANS,
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
