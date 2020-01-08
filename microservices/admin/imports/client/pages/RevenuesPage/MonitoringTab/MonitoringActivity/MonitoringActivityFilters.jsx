// @flow
import React from 'react';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';

type MonitoringActivityFiltersProps = {};

const MonitoringActivityFilters = ({
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
}: MonitoringActivityFiltersProps) => (
  <div className="flex">
    <div className="flex-col mr-16">
      <label htmlFor="activityRange">Date de l'activité</label>
      <DateRangePicker
        range={activityRange}
        onChange={setActivityRange}
        numberOfMonths={3}
        enableOutsideDays
        isDayBlocked={() => false}
        isOutsideRange={() => false}
        id="activityRange"
      />
    </div>
    <div className="flex-col">
      <label htmlFor="createdAt">Date de création du dossier</label>
      <DateRangePicker
        range={createdAtRange}
        onChange={setCreatedAtRange}
        numberOfMonths={3}
        enableOutsideDays
        isDayBlocked={() => false}
        isOutsideRange={() => false}
        id="createdAt"
      />
    </div>
  </div>
);

export default MonitoringActivityFilters;
