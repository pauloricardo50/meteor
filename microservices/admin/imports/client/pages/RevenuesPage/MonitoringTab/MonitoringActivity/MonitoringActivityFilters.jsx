// @flow
import React from 'react';
import moment from 'moment';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';

type MonitoringActivityFiltersProps = {};

// Date at which we started enforcing continuous status changes
const minDate = moment('15/11/2019', 'DD/MM/YYYY');

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
        isDayBlocked={() => false}
        id="activityRange"
      />
    </div>
    <div className="flex-col">
      <label htmlFor="createdAt">Date de création du dossier</label>
      <DateRangePicker
        range={createdAtRange}
        onChange={setCreatedAtRange}
        numberOfMonths={3}
        id="createdAt"
        enableOutsideDays={false}
        isOutsideRange={date => date.isBefore(minDate)}
      />
    </div>
  </div>
);

export default MonitoringActivityFilters;
