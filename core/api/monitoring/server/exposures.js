import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import {
  collectionStatusChanges,
  loanMonitoring,
  loanStatusChanges,
} from '../queries';
import {
  collectionStatusChanges as collectionStatusChangesResolver,
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
      revenueFilters: Match.Maybe(Object),
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
      loanCreatedAtFrom: Match.Maybe(Match.OneOf(null, Date)),
      loanCreatedAtTo: Match.Maybe(Match.OneOf(null, Date)),
    },
  },
  resolver: loanStatusChangesResolver,
});

exposeQuery({
  query: collectionStatusChanges,
  overrides: {
    validateParams: {
      fromDate: Match.Maybe(Match.OneOf(null, Date)),
      toDate: Match.Maybe(Match.OneOf(null, Date)),
      createdAtFrom: Match.Maybe(Match.OneOf(null, Date)),
      createdAtTo: Match.Maybe(Match.OneOf(null, Date)),
      collection: String,
    },
  },
  resolver: collectionStatusChangesResolver,
});
