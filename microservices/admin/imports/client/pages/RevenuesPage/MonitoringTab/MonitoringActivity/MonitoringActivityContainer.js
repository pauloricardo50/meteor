import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { collectionStatusChanges } from 'core/api/monitoring/queries';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

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

export default withProps(
  ({
    activityRange: { startDate: fromDate, endDate: toDate },
    createdAtRange: { startDate, endDate },
    collection,
  }) => {
    const { data } = useStaticMeteorData(
      {
        query: collectionStatusChanges,
        params: {
          fromDate,
          toDate,
          createdAtFrom: startDate,
          createdAtTo: endDate,
          collection,
        },
      },
      [fromDate, toDate, startDate, endDate, collection],
    );

    return { data };
  },
);
