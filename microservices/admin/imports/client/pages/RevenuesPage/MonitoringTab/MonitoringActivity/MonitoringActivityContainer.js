import { compose, withState } from 'recompose';
import moment from 'moment';

import { loanStatusChanges } from 'core/api/monitoring/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';

export default compose(
  withState('activityRange', 'setActivityRange', {
    startDate: moment()
      .subtract(30, 'd')
      .toDate(),
    endDate: moment()
      .endOf('day')
      .toDate(),
  }),
  withState('createdAtRange', 'setCreatedAtRange', {
    startDate: null,
    endDate: null,
  }),
  withSmartQuery({
    query: loanStatusChanges,
    params: ({ activityRange: { startDate, endDate } }) => ({
      fromDate: startDate,
      toDate: endDate,
      breakdown: 'assignee',
    }),
    dataName: 'data',
  }),
);
