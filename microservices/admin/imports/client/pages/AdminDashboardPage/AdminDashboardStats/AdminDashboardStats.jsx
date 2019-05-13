// @flow
import React from 'react';
import CountUp from 'react-countup';

import { Percent } from 'core/components/Translation';
import Select from 'core/components/Select';
import AdminDashboardStatsContainer from './AdminDashboardStatsContainer';
import StatItem from './StatItem';

type AdminDashboardStatsProps = {};

const AdminDashboardStats = ({
  newLoans,
  setPeriod,
  period,
}: AdminDashboardStatsProps) => (
  <div className="admin-stats">
    <StatItem
      value={<CountUp end={newLoans.count} />}
      increment={<Percent showPlus value={newLoans.change} />}
      positive={newLoans.change > 0}
      title="Nouveaux dossiers"
    >
      <Select
        options={[{ id: 7, label: '7 derniers jours' }, { id: 30, label: '30 derniers jours' }]}
        onChange={(_, v) => setPeriod(v)}
        value={period}
      />
    </StatItem>
  </div>
);

export default AdminDashboardStatsContainer(AdminDashboardStats);
