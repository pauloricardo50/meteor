// @flow
import React, { useState } from 'react';
import moment from 'moment';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';
import { adminOrganisations } from 'core/api/organisations/queries';
import MonitoringActivity from './MonitoringActivity';
import LoanMonitoringChart from './LoanMonitoringChart';

const MonitoringTab = () => {
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: moment()
      .subtract(3, 'M')
      .toDate(),
    endDate: moment()
      .add(3, 'M')
      .toDate(),
  });

  const { data: admins, loading: userLoading } = useStaticMeteorData({
    query: adminUsers,
    params: { roles: [ROLES.ADMIN], $body: { name: 1 } },
  });
  const {
    data: referringOrganisations,
    loading: orgLoading,
  } = useStaticMeteorData({
    query: adminOrganisations,
    params: { hasReferredUsers: true, $body: { name: 1 } },
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

      <h2 className="text-center">Volume hypothécaire</h2>
      <LoanMonitoringChart
        initialValue="loanValue"
        initialGroupBy="status"
        allowedGroupBy={['status', 'createdAt']}
        admins={admins}
        referringOrganisations={referringOrganisations}
      />

      <h2 className="text-center">Dossiers</h2>
      <LoanMonitoringChart
        initialValue="count"
        initialGroupBy="createdAt"
        allowedGroupBy={['status', 'createdAt']}
        admins={admins}
        referringOrganisations={referringOrganisations}
      />

      <h2 className="text-center">Activité</h2>
      <MonitoringActivity />
    </div>
  );
};

export default MonitoringTab;
