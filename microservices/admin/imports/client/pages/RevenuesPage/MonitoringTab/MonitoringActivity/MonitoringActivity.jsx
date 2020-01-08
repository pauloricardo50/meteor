// @flow
import React from 'react';

import Table from 'core/components/Table';
import StatusLabel from 'core/components/StatusLabel';
import { LOAN_STATUS_ORDER, LOANS_COLLECTION, ROLES } from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminUsers } from 'core/api/users/queries';
import MonitoringActivityFilters from './MonitoringActivityFilters';
import MonitoringActivityContainer from './MonitoringActivityContainer';

const statuses = LOAN_STATUS_ORDER.slice(1);

const getColumnOptions = () => [
  { id: 'assignee', label: 'Conseiller' },
  ...statuses.map(status => ({
    id: status,
    label: (
      <span>
        -> <StatusLabel status={status} collection={LOANS_COLLECTION} />
      </span>
    ),
  })),
  { id: 'total', label: 'Total', format: value => <b>{value}</b> },
];

const getRows = ({ data, admins }) => {
  const byAdminData = admins.map(({ name, _id }) => {
    const adminData = data.find(({ _id: dataId }) => dataId === _id) || {
      statusChanges: [],
    };
    return {
      id: _id,
      columns: [
        name,
        ...statuses.map(status =>
          adminData.statusChanges
            .filter(({ nextStatus }) => nextStatus === status)
            .reduce((tot, { count }) => tot + count, 0),
        ),
        adminData.totalStatusChangeCount || 0,
      ],
    };
  });

  const totalColumns = byAdminData.map(({ columns }) => columns.slice(1));
  const total = totalColumns
    .slice(1)
    .reduce(
      (tot, columns) => tot.map((value, index) => value + columns[index]),
      totalColumns[0],
    );

  return [
    ...byAdminData,
    {
      id: 'total',
      columns: ['Total', ...total].map((value, index) => (
        <b key={index}>{value}</b>
      )),
    },
  ];
};

const MonitoringActivity = ({
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
  data = [],
}) => {
  const { data: admins, loading } = useStaticMeteorData({
    query: adminUsers,
    params: { roles: [ROLES.ADMIN], $body: { name: 1 } },
  });
  const rows = loading ? [] : getRows({ data, admins });

  return (
    <div className="monitoring-activity">
      <MonitoringActivityFilters
        activityRange={activityRange}
        setActivityRange={setActivityRange}
        createdAtRange={createdAtRange}
        setCreatedAtRange={setCreatedAtRange}
      />

      <Table
        rows={rows}
        columnOptions={getColumnOptions()}
        initialOrderBy={9}
      />
    </div>
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
