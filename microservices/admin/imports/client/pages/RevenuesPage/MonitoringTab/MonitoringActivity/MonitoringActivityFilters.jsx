import React from 'react';
import moment from 'moment';

import { ACQUISITION_CHANNELS } from 'core/api/users/userConstants';
import Box from 'core/components/Box';
import Button from 'core/components/Button';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';

const MonitoringActivityFilters = ({
  activityRange,
  setActivityRange,
  organisationId,
  setOrganisationId,
  acquisitionChannel,
  setAcquisitionChannel,
  organisations,
}) => (
  <div className="flex" style={{ alignItems: 'center' }}>
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
            startDate: moment().subtract(30, 'd').toDate(),
            endDate: moment().toDate(),
          });
        }}
      >
        Activité dans les 30 derniers jours
      </Button>
    </Box>
    <MongoSelect
      value={organisationId}
      onChange={setOrganisationId}
      options={organisations.map(({ _id, name } = {}) => ({
        id: _id,
        label: name,
      }))}
      id="referredByOrganisationLink"
      label="Referral"
      className="mr-8"
    />
    <MongoSelect
      value={acquisitionChannel}
      onChange={setAcquisitionChannel}
      options={Object.values(ACQUISITION_CHANNELS).map(channel => ({
        id: channel,
        label: <T id={`Forms.acquisitionChannel.${channel}`} />,
      }))}
      id="acquisitionChannel"
      label="Canal d'acquisition"
      className="mr-8"
    />
  </div>
);

export default MonitoringActivityFilters;
