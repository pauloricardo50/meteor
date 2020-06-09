import React from 'react';
import moment from 'moment';

import { ACQUISITION_CHANNELS } from 'core/api/users/userConstants';
import Box from 'core/components/Box';
import Button from 'core/components/Button';
import DateRangePicker from 'core/components/DateInput/DateRangePicker';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';

// Date at which we started enforcing continuous status changes
const minDate = moment('15/11/2019', 'DD/MM/YYYY');

const MonitoringActivityFilters = ({
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
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
    <Box title="Date de création du dossier" className="mr-8">
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
      options={[
        ACQUISITION_CHANNELS.REFERRAL_PRO,
        ACQUISITION_CHANNELS.REFERRAL_ORGANIC,
        ACQUISITION_CHANNELS.REFERRAL_API,
      ].map(channel => ({
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
