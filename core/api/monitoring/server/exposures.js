import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { collectionStatusChanges, loanMonitoring } from '../queries';
import {
  collectionStatusChanges as collectionStatusChangesResolver,
  loanMonitoring as loanMonitoringResolver,
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
  query: collectionStatusChanges,
  overrides: {
    validateParams: {
      fromDate: Match.Maybe(Match.OneOf(null, Date)),
      toDate: Match.Maybe(Match.OneOf(null, Date)),
      collection: String,
      organisationId: Match.Maybe(Object),
      acquisitionChannel: Match.Maybe(Object),
    },
  },
  resolver: collectionStatusChangesResolver,
});
