import { withProps } from 'recompose';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';
import { COLLECTION_QUERIES } from './monitoringActivityHelpers';

const CollectionMonitoringActivity = withProps(
  ({ createdAtRange, collection }) => {
    const {
      data: staticData = [],
      loading,
    } = useStaticMeteorData(COLLECTION_QUERIES[collection](createdAtRange), [
      createdAtRange,
      collection,
    ]);

    return {
      staticData,
      staticDataIsLoading: loading,
    };
  },
);

export default CollectionMonitoringActivity(MonitoringActivity);
