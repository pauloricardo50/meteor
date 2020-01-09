// @flow
import React from 'react';
import uniq from 'lodash/uniq';

import Table from 'core/components/Table';
import { Percent } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { LOAN_STATUS_ORDER, LOANS_COLLECTION, ROLES } from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminUsers } from 'core/api/users/queries';
import MonitoringActivityFilters from './MonitoringActivityFilters';
import MonitoringActivityContainer from './MonitoringActivityContainer';

const statuses = LOAN_STATUS_ORDER.slice(1);

const getColumnOptions = () => [
  { id: 'assignee', label: 'Conseiller' },
  { id: 'loanCount', label: 'Nb. de dossiers distincts' },
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
    const loanCount = uniq(adminData.loanIds).length;
    return {
      id: _id,
      columns: [
        name,
        loanCount,
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

  const rawRowData = [
    ...byAdminData,
    { id: 'total', columns: ['Total', ...total] },
  ];

  return rawRowData.map(({ columns, ...obj }) => {
    const [name, loanCount, ...rest] = columns;
    const [restWithoutLast, last] = [
      rest.slice(0, rest.length - 1),
      rest.slice(-1),
    ];

    return {
      ...obj,
      columns: [
        name,
        loanCount,
        ...restWithoutLast.map((num, index) => (
          <span key={index}>
            {num} (<Percent value={num / loanCount} />)
          </span>
        )),
        last,
      ],
    };
  });
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
        initialOrderBy={10}
      />
    </div>
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
