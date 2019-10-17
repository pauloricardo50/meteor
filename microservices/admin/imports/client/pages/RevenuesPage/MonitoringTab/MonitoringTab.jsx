// @flow
import React from 'react';
import MonitoringContainer from './MonitoringContainer';
import LoanMonitoringChart from './LoanMonitoringChart';

type MonitoringTabProps = {};

const MonitoringTab = ({
  category,
  status,
  groupBy,
  value,
  withAnonymous,
  makeSetState,
  data,
}: MonitoringTabProps) => (
  <div>
    <h1>Monitoring</h1>

    <h2 className="text-center">Revenus</h2>
    <LoanMonitoringChart
      initialValue="revenues"
      initialGroupBy="revenueDate"
      allowedGroupBy={['status', 'createdAt', 'revenueDate']}
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
      initialGroupBy="status"
      allowedGroupBy={['status', 'createdAt']}
    />
  </div>
);

export default MonitoringContainer(MonitoringTab);
