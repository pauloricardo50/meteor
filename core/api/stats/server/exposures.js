import { exposeQuery } from '../../queries/queryHelpers';
import { newLoans, loanHistogram, loansWithoutRevenues } from '../queries';
import {
  newLoansResolver,
  loanHistogramResolver,
  loansWithoutRevenuesResolver,
} from './stats';

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

exposeQuery({
  query: loansWithoutRevenues,
  resolver: loansWithoutRevenuesResolver,
});
