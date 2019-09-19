import { exposeQuery } from '../../queries/queryHelpers';
import { newLoans, loanHistogram } from '../queries';
import { newLoansResolver, loanHistogramResolver } from '../stats';

exposeQuery({
  query: newLoans,
  overrides: { validateParams: { period: Number, withAnonymous: Boolean } },
  options: { allowFilterById: true },
  resolver: newLoansResolver,
});

exposeQuery({
  query: loanHistogram,
  overrides: { validateParams: { period: Number, withAnonymous: Boolean } },
  options: { allowFilterById: true },
  resolver: loanHistogramResolver,
});
