import Lenders from '.';
import { lender } from '../fragments';
import { LENDERS_QUERIES } from './lenderConstants';

export const loanLenders = Lenders.createQuery(LENDERS_QUERIES.LOAN_LENDERS, {
  ...lender(),
  $options: { sort: { createdAt: -1 } },
});
