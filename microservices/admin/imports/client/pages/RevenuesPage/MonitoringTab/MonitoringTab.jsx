// @flow
import React, { useState } from 'react';
import moment from 'moment';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import LoanMonitoringChart from './LoanMonitoringChart';
import MonitoringActivity from './MonitoringActivity';

const MonitoringTab = () => {
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: moment()
      .subtract(3, 'M')
      .toDate(),
    endDate: moment()
      .add(3, 'M')
      .toDate(),
  });

  return (
    <div>
      <h1>Monitoring</h1>

      <h2 className="text-center">Revenus</h2>
      <LoanMonitoringChart
        initialValue="revenues"
        initialGroupBy="revenueDate"
        allowedGroupBy={['status', 'createdAt', 'revenueDate']}
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
      />

      <h2 className="text-center">Dossiers</h2>
      <LoanMonitoringChart
        initialValue="count"
        initialGroupBy="createdAt"
        allowedGroupBy={['status', 'createdAt']}
      />

      <h2 className="text-center">Activité</h2>
      <MonitoringActivity />
    </div>
  );
};

export default MonitoringTab;
