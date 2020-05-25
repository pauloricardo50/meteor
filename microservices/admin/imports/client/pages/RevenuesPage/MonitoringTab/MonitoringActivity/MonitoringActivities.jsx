import React, { useState } from 'react';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';

import CollectionMonitoringActivity from './CollectionMonitoringActivity';
import { MonitoringActivityFilterContainer } from './MonitoringActivityContainer';
import MonitoringActivityFilters from './MonitoringActivityFilters';

const MonitoringActivities = props => {
  const [collection, setCollection] = useState(LOANS_COLLECTION);

  return (
    <div className="monitoring-activity">
      <h2 className="text-center">Activité</h2>
      <MonitoringActivityFilters {...props} />
      <RadioTabs
        options={[
          { id: LOANS_COLLECTION, label: 'Dossiers hypothécaires' },
          { id: INSURANCE_REQUESTS_COLLECTION, label: 'Dossiers assurances' },
          { id: INSURANCES_COLLECTION, label: 'Assurances' },
        ]}
        onChange={setCollection}
        value={collection}
      />
      <CollectionMonitoringActivity {...props} collection={collection} />
    </div>
  );
};

export default MonitoringActivityFilterContainer(MonitoringActivities);
