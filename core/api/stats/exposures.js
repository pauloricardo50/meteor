import { exposeQuery } from '../queries/queryHelpers';
import { newLoans } from './queries';
import { newLoansResolver } from './stats';

exposeQuery(newLoans, {
  validateParams: { period: Number },
});

newLoans.resolve(newLoansResolver);
