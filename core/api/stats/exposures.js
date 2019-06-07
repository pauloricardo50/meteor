import { exposeQuery } from '../queries/queryHelpers';
import { newLoans, loanHistogram } from './queries';
import { newLoansResolver, loanHistogramResolver } from './stats';

exposeQuery(
  newLoans,
  { validateParams: { period: Number } },
  { allowFilterById: true },
);
newLoans.resolve(newLoansResolver);

exposeQuery(
  loanHistogram,
  { validateParams: { period: Number } },
  { allowFilterById: true },
);
loanHistogram.resolve(loanHistogramResolver);
