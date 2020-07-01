import { useState } from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { collectionStatusChanges } from 'core/api/monitoring/queries';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import useMeteorData from 'core/hooks/useMeteorData';

export const MonitoringActivityFilterContainer = withProps(() => {
  const { data: organisations = [], loading } = useMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { referredUsersCount: { $gte: 1 } },
      name: 1,
      $options: { sort: { name: 1 } },
    },
  });

  const [activityRange, setActivityRange] = useState({
    startDate: moment().subtract(30, 'd').toDate(),
    endDate: moment().endOf('day').toDate(),
  });

  const [organisationId, setOrganisationId] = useState();
  const [acquisitionChannel, setAcquisitionChannel] = useState();

  return {
    activityRange,
    setActivityRange,
    organisationId,
    setOrganisationId,
    acquisitionChannel,
    setAcquisitionChannel,
    organisations: loading ? [] : organisations,
  };
});

export default withProps(
  ({
    activityRange: { startDate: fromDate, endDate: toDate },
    collection,
    organisationId,
    acquisitionChannel,
  }) => {
    const { data, loading } = useMeteorData(
      {
        query: collectionStatusChanges,
        params: {
          acquisitionChannel,
          collection,
          fromDate,
          organisationId,
          toDate,
        },
      },
      [acquisitionChannel, collection, fromDate, organisationId, toDate],
    );

    console.log('data:', data);
    return { data, loading };
  },
);
