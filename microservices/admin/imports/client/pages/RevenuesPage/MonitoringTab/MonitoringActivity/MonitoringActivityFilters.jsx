import React from 'react';
import moment from 'moment';

import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import Button from 'core/components/Button';
import Box from 'core/components/Box';

// Date at which we started enforcing continuous status changes
const minDate = moment('15/11/2019', 'DD/MM/YYYY');

const MonitoringActivityFilters = ({
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
}) => (
  <div className="flex">
    <Box className="mr-8" title={"Date de l'activité"}>
      <div className="flex-col mb-8">
        <DateRangePicker
          range={activityRange}
          onChange={(...args) => {
            setActivityRange(...args);
          }}
          numberOfMonths={3}
          isDayBlocked={() => false}
          id="activityRange"
        />
      </div>

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
    </Box>
    <Box title="Date de création du dossier">
      <div className="flex-col mb-8">
        <DateRangePicker
          range={createdAtRange}
          onChange={setCreatedAtRange}
          numberOfMonths={3}
          id="createdAt"
          enableOutsideDays={false}
          isOutsideRange={date => date && date.isBefore(minDate)}
        />
      </div>

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
    </Box>
  </div>
);

export default MonitoringActivityFilters;
