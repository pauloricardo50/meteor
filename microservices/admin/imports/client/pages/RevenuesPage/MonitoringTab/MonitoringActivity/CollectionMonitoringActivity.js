import { withProps } from 'recompose';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';
import { COLLECTION_QUERIES } from './monitoringActivityHelpers';

const CollectionMonitoringActivity = withProps(
  ({ createdAtRange, organisationId, collection }) => {
    const {
      data: staticData = [],
      loading,
    } = useStaticMeteorData(
      COLLECTION_QUERIES[collection]({ createdAtRange, organisationId }),
      [createdAtRange, organisationId, collection],
    );

    return {
      staticData,
      staticDataIsLoading: loading,
    };
  },
);

export default CollectionMonitoringActivity(MonitoringActivity);
