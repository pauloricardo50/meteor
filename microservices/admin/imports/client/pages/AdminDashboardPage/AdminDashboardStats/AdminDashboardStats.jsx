// @flow
import React from 'react';
import CountUp from 'react-countup';
import moment from 'moment';

import { Percent } from 'core/components/Translation';
import Select from 'core/components/Select';
import Histogram from 'core/components/charts/Histogram';
import IconButton from 'core/components/IconButton';
import AdminDashboardStatsContainer from './AdminDashboardStatsContainer';
import StatItem from './StatItem';

type AdminDashboardStatsProps = {};

const formatDate = date =>
  moment.utc(moment(date).format('YYYY-MM-DD')).valueOf();

const AdminDashboardStats = ({
  newLoans,
  setPeriod,
  period,
  showChart,
  setShowChart,
  loanHistogram,
}: AdminDashboardStatsProps) => (
  <div className="admin-stats">
    <StatItem
      value={<CountUp end={newLoans.count} />}
      increment={<Percent showPlus value={newLoans.change} />}
      positive={newLoans.change > 0}
      title="Nouveaux dossiers"
      top={(
        <>
          <Select
            options={[
              { id: 7, label: '7 derniers jours' },
              { id: 30, label: '30 derniers jours' },
            ]}
            onChange={(_, v) => setPeriod(v)}
            value={period}
          />
          <IconButton
            type={showChart ? 'close' : 'chart'}
            onClick={() => setShowChart(!showChart)}
          />
        </>
      )}
    >
      {showChart && (
        <div className="chart">
          <Histogram
            data={loanHistogram.map(({ date, count }) => [
              formatDate(date),
              count,
            ])}
            legend={{ enabled: false }}
            name="Nouveaux dossiers"
          />
        </div>
      )}
    </StatItem>
  </div>
);

export default AdminDashboardStatsContainer(AdminDashboardStats);
