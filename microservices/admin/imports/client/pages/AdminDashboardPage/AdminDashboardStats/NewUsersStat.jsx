import React from 'react';
import CountUp from 'react-countup';
import { compose, withState } from 'recompose';
import moment from 'moment';

import { newUsers, userHistogram } from 'core/api/stats/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { Percent } from 'core/components/Translation';
import Select from 'core/components/Select';
import Histogram from 'core/components/charts/Histogram';
import IconButton from 'core/components/IconButton';
import DialogSimple from 'core/components/DialogSimple';
import { ROLES } from 'imports/core/api/constants';
import StatItem from './StatItem';

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const NewUsersStat = ({
  newUsers,
  setPeriod,
  period,
  showChart,
  setShowChart,
  userHistogram,
  verified,
  setVerified,
}) => (
  <StatItem
    value={<CountUp end={newUsers.count} />}
    increment={<Percent showPlus value={newUsers.change} />}
    positive={newUsers.change > 0}
    title="Nouveaux clients"
    large
    top={
      <>
        <DialogSimple
          buttonProps={{ label: 'Options', raised: false, primary: true }}
          title="Options"
          closeOnly
        >
          <Select
            label="Période"
            options={[
              { id: 7, label: '7 derniers jours' },
              { id: 30, label: '30 derniers jours' },
              { id: 90, label: '90 derniers jours' },
            ]}
            onChange={setPeriod}
            value={period}
          />
          <Select
            label="Email vérifié?"
            options={[
              { id: true, label: 'Oui' },
              { id: false, label: "C'est égal" },
            ]}
            onChange={setVerified}
            value={verified}
          />
        </DialogSimple>
        <IconButton
          type={showChart ? 'close' : 'chart'}
          onClick={() => setShowChart(!showChart)}
        />
      </>
    }
  >
    {showChart && (
      <div className="chart">
        <Histogram
          data={userHistogram.map(({ _id, count }) => [formatDate(_id), count])}
          legend={{ enabled: false }}
          name="Nouveaux clients"
        />
      </div>
    )}
  </StatItem>
);

export default compose(
  withState('period', 'setPeriod', 30),
  withState('verified', 'setVerified', true),
  withState('showChart', 'setShowChart', false),
  withSmartQuery({
    query: newUsers,
    dataName: 'newUsers',
    params: ({ period, verified }) => ({ period, roles: ROLES.USER, verified }),
    refetchOnMethodCall: false,
  }),
  withSmartQuery({
    query: userHistogram,
    dataName: 'userHistogram',
    params: ({ period, verified }) => ({ period, roles: ROLES.USER, verified }),
    refetchOnMethodCall: false,
  }),
)(NewUsersStat);
