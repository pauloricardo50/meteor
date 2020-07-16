import React, { useState } from 'react';
import moment from 'moment';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import LoanMonitoringChart from './LoanMonitoringChart';

const MonitoringTab = () => {
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: moment().subtract(3, 'M').toDate(),
    endDate: moment().add(3, 'M').toDate(),
  });

  const { data: admins, loading: userLoading } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      office: 1,
      $options: { sort: { firstName: 1 } },
    },
  });
  const {
    data: referringOrganisations,
    loading: orgLoading,
  } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { referredUsersCount: { $gte: 1 } },
      name: 1,
      $options: { sort: { name: 1 } },
    },
  });

  if (userLoading || orgLoading) {
    return null;
  }

  return (
    <div>
      <h1>Monitoring</h1>

      <h2 className="text-center">Revenus</h2>
      <LoanMonitoringChart
        initialValue="revenues"
        initialGroupBy="revenueDate"
        allowedGroupBy={['status', 'createdAt', 'revenueDate']}
        admins={admins}
        referringOrganisations={referringOrganisations}
        additionalFilters={['revenueType']}
        filters={
          <DateRangePicker
            range={revenueDateRange}
            onChange={setRevenueDateRange}
            style={{}}
          />
        }
        postProcess={({ data, groupBy }) => {
          if (groupBy === 'status') {
            return data;
          }

          if (!revenueDateRange.startDate && !revenueDateRange.endDate) {
            return data;
          }

          return data.filter(({ _id: { month, year } }) => {
            const dateTime = new Date(year, month, 0).getTime();
            return (
              dateTime >= revenueDateRange.startDate &&
              dateTime <= revenueDateRange.endDate
            );
          });
        }}
      />
    </div>
  );
};

export default MonitoringTab;
