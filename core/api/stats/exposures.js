import { Match } from 'meteor/check';

import { exposeQuery } from '../queries/queryHelpers';
import { newLoans, loanHistogram } from './queries';
import { newLoansResolver, loanHistogramResolver } from './stats';

exposeQuery(newLoans, {
  validateParams: { period: Number },
});

newLoans.resolve(newLoansResolver);

exposeQuery(loanHistogram, {
  validateParams: {
    resolution: Match.Maybe(Match.OneOf('day', 'month')),
    period: Number,
  },
});

loanHistogram.resolve(loanHistogramResolver);
