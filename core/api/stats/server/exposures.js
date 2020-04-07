import { exposeQuery } from '../../queries/queryHelpers';
import {
  loanHistogram,
  loansWithoutRevenues,
  newLoans,
  newUsers,
  userHistogram,
} from '../queries';
import {
  loanHistogramResolver,
  loansWithoutRevenuesResolver,
  newLoansResolver,
  newUsersResolver,
  userHistogramResolver,
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

exposeQuery({
  query: newUsers,
  overrides: {
    validateParams: { period: Number, roles: String, verified: Boolean },
  },
  resolver: newUsersResolver,
});

exposeQuery({
  query: userHistogram,
  overrides: {
    validateParams: { period: Number, roles: String, verified: Boolean },
  },
  resolver: userHistogramResolver,
});
