import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { loanMonitoring } from '../queries';
import { loanMonitoring as loanMonitoringResolver } from './resolvers';

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
