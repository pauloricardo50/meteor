// @flow
import React from 'react';
import MonitoringFilters from './MonitoringFilters';
import MonitoringChart from './MonitoringChart';
import MonitoringContainer from './MonitoringContainer';

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
    <MonitoringFilters
      category={category}
      makeSetState={makeSetState}
      status={status}
      groupBy={groupBy}
      value={value}
      withAnonymous={withAnonymous}
    />
    <MonitoringChart data={data} groupBy={groupBy} value={value} />
  </div>
);

export default MonitoringContainer(MonitoringTab);
