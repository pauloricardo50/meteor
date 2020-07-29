import { exposeQuery } from '../../queries/queryHelpers';
import { loanHistogram, loansWithoutRevenues, newLoans } from '../queries';
import {
  loanHistogramResolver,
  loansWithoutRevenuesResolver,
  newLoansResolver,
} from './stats';

exposeQuery({
  query: newLoans,
  overrides: { validateParams: { period: Number, withAnonymous: Boolean } },
  resolver: newLoansResolver,
});

exposeQuery({
  query: loanHistogram,
  overrides: { validateParams: { period: Number, withAnonymous: Boolean } },
  resolver: loanHistogramResolver,
});

exposeQuery({
  query: loansWithoutRevenues,
  resolver: loansWithoutRevenuesResolver,
});
