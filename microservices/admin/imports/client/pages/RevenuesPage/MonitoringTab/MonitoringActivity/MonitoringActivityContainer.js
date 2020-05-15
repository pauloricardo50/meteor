import moment from 'moment';
import { compose, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { loanStatusChanges } from 'core/api/monitoring/queries';

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
    params: ({
      activityRange: { startDate: fromDate, endDate: toDate },
      createdAtRange: {
        startDate: loanCreatedAtFrom,
        endDate: loanCreatedAtTo,
      },
    }) => ({
      fromDate,
      toDate,
      loanCreatedAtFrom,
      loanCreatedAtTo,
    }),
    dataName: 'data',
  }),
);
