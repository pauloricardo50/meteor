import { useState } from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { collectionStatusChanges } from 'core/api/monitoring/queries';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

export const MonitoringActivityFilterContainer = withProps(() => {
  const { data: organisations = [], loading } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { referredUsersCount: { $gte: 1 } },
      name: 1,
      $options: { sort: { name: 1 } },
    },
  });

  const [activityRange, setActivityRange] = useState({
    startDate: moment()
      .subtract(30, 'd')
      .toDate(),
    endDate: moment()
      .endOf('day')
      .toDate(),
  });

  const [createdAtRange, setCreatedAtRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [organisationId, setOrganisationId] = useState();
  const [acquisitionChannel, setAcquisitionChannel] = useState();

  return {
    activityRange,
    setActivityRange,
    createdAtRange,
    setCreatedAtRange,
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
    createdAtRange: { startDate, endDate },
    collection,
    organisationId,
    acquisitionChannel,
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
          organisationId,
          acquisitionChannel,
        },
      },
      [
        fromDate,
        toDate,
        startDate,
        endDate,
        collection,
        organisationId,
        acquisitionChannel,
      ],
    );

    return { data };
  },
);
