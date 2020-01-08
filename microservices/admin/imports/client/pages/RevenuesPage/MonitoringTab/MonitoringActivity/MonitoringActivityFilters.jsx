// @flow
import React from 'react';
import moment from 'moment';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Button from 'core/components/Button';

type MonitoringActivityFiltersProps = {};

// Date at which we started enforcing continuous status changes
const minDate = moment('15/11/2019', 'DD/MM/YYYY');

const MonitoringActivityFilters = ({
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
}: MonitoringActivityFiltersProps) => (
  <div className="flex-col">
    <div className="flex mb-8">
      <Button
        raised
        primary
        className="mr-8"
        onClick={() => {
          setActivityRange({ startDate: null, endDate: null });
          setCreatedAtRange({
            startDate: moment(minDate).toDate(),
            endDate: moment().toDate(),
          });
        }}
      >
        Performance totale des conseillers
      </Button>
      <Button
        raised
        primary
        onClick={() => {
          setActivityRange({
            startDate: moment()
              .subtract(30, 'd')
              .toDate(),
            endDate: moment().toDate(),
          });
          setCreatedAtRange({
            startDate: null,
            endDate: null,
          });
        }}
      >
        Activité dans les 30 derniers jours
      </Button>
    </div>

    <div className="flex">
      <div className="flex-col mr-16">
        <label htmlFor="activityRange">Date de l'activité</label>
        <DateRangePicker
          range={activityRange}
          onChange={(...args) => {
            console.log(args);
            setActivityRange(...args);
          }}
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
          isOutsideRange={date => date && date.isBefore(minDate)}
        />
      </div>
    </div>
  </div>
);

export default MonitoringActivityFilters;
