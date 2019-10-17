import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { loanMonitoring, loanStatusChanges } from '../queries';
import {
  loanMonitoring as loanMonitoringResolver,
  loanStatusChanges as loanStatusChangesResolver,
} from './resolvers';

exposeQuery({
  query: loanMonitoring,
  overrides: {
    validateParams: {
      groupBy: String,
      value: String,
      filters: Match.Maybe(Object),
    },
  },
  resolver: loanMonitoringResolver,
});

exposeQuery({
  query: loanStatusChanges,
  overrides: {
    validateParams: {
      fromDate: Match.Maybe(Match.OneOf(null, Date)),
      toDate: Match.Maybe(Match.OneOf(null, Date)),
    },
  },
  resolver: loanStatusChangesResolver,
});
