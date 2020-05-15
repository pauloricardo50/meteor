import moment from 'moment';
import { compose, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { collectionStatusChanges } from 'core/api/monitoring/queries';

export const MonitoringActivityFilterContainer = compose(
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
);

export default compose(
  withSmartQuery({
    query: collectionStatusChanges,
    params: ({
      activityRange: { startDate: fromDate, endDate: toDate },
      createdAtRange: { startDate, endDate },
      collection,
    }) => ({
      fromDate,
      toDate,
      createdAtFrom: startDate,
      createdAtTo: endDate,
      collection,
    }),
    dataName: 'data',
  }),
);
