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
  makeSetState,
  data,
}: MonitoringTabProps) => {
  console.log('data', data);

  return (
    <div>
      <h1>Monitoring</h1>
      <MonitoringFilters
        category={category}
        makeSetState={makeSetState}
        status={status}
        groupBy={groupBy}
        value={value}
      />
      <MonitoringChart data={data} groupBy={groupBy} value={value} />
    </div>
  );
};

export default MonitoringContainer(MonitoringTab);
