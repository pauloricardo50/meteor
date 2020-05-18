import React, { useState } from 'react';

import RadioTabs from 'core/components/RadioButtons/RadioTabs';

import InsuranceMonitoringActivity from './InsuranceMonitoringActivity';
import InsuranceRequestMonitoringActivity from './InsuranceRequestMonitoringActivity';
import LoanMonitoringActivity from './LoanMonitoringActivity';
import { MonitoringActivityFilterContainer } from './MonitoringActivityContainer';
import MonitoringActivityFilters from './MonitoringActivityFilters';

const MonitoringActivities = props => {
  const [collection, setCollection] = useState('loans');

  return (
    <div className="monitoring-activity">
      <h2 className="text-center">Activité</h2>
      <MonitoringActivityFilters {...props} />
      <RadioTabs
        options={[
          { id: 'loans', label: 'Dossiers hypothécaires' },
          { id: 'insuranceRequests', label: 'Dossiers assurances' },
          { id: 'insurances', label: 'Assurance' },
        ]}
        onChange={setCollection}
        value={collection}
      />
      {collection === 'loans' && <LoanMonitoringActivity {...props} />}
      {collection === 'insuranceRequests' && (
        <InsuranceRequestMonitoringActivity {...props} />
      )}
      {collection === 'insurances' && (
        <InsuranceMonitoringActivity {...props} />
      )}
    </div>
  );
};

export default MonitoringActivityFilterContainer(MonitoringActivities);
