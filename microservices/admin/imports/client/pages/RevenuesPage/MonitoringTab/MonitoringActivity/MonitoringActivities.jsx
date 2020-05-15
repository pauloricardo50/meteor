import React, { useState } from 'react';

import RadioTabs from 'core/components/RadioButtons/RadioTabs';

import InsuranceMonitoringActivity from './InsuranceMonitoringActivity';
import InsuranceRequestMonitoringActivity from './InsuranceRequestMonitoringActivity';
import LoanMonitoringActivity from './LoanMonitoringActivity';

const MonitoringActivities = () => {
  const [collection, setCollection] = useState('insurances');
  return collection === 'loans' ? (
    <>
      <h2 className="text-center">Activité des dossiers hypothécaire</h2>
      <LoanMonitoringActivity />
    </>
  ) : collection === 'insuranceRequests' ? (
    <>
      <h2 className="text-center">Activité des dossiers assurance</h2>
      <InsuranceRequestMonitoringActivity />
    </>
  ) : (
    <>
      <h2 className="text-center">Activité des assurances</h2>
      <InsuranceMonitoringActivity />
    </>
  );
};

export default MonitoringActivities;
