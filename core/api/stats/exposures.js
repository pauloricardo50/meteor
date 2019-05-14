import { exposeQuery } from '../queries/queryHelpers';
import { newLoans, loanHistogram } from './queries';
import { newLoansResolver, loanHistogramResolver } from './stats';

exposeQuery(newLoans, { validateParams: { period: Number } });
newLoans.resolve(newLoansResolver);

exposeQuery(loanHistogram, { validateParams: { period: Number } });
loanHistogram.resolve(loanHistogramResolver);
