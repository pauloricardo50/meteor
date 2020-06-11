import { withProps } from 'recompose';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';
import { COLLECTION_QUERIES } from './monitoringActivityHelpers';

const CollectionMonitoringActivity = withProps(
  ({ createdAtRange, organisationId, collection, acquisitionChannel }) => {
    const { data: staticData = [], loading } = useStaticMeteorData(
      COLLECTION_QUERIES[collection]({
        createdAtRange,
        organisationId,
        acquisitionChannel,
      }),
      [createdAtRange, organisationId, acquisitionChannel, collection],
    );

    return {
      staticData,
      staticDataIsLoading: loading,
    };
  },
);

export default CollectionMonitoringActivity(MonitoringActivity);
