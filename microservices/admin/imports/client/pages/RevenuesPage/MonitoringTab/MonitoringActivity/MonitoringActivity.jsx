import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import TableWithModal from 'core/components/Table/TableWithModal';
import { Percent } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivityContainer from './MonitoringActivityContainer';

const sharedColumnOptions = [
  { id: 'assignee', label: 'Conseiller principal' },
  { id: 'count', label: 'Nb. de dossiers distincts' },
];

const getRows = ({
  data,
  admins,
  staticData,
  hasCreatedAtRange,
  getColumnsForAdminRow,
}) => {
  const byAdminData = admins.map(
    getColumnsForAdminRow({ data, staticData, hasCreatedAtRange }),
  );

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

  return rawRowData.map(({ columns, ...obj }, index) => {
    const [name, count, ...rest] = columns;
    const [restWithoutLast, last] = [
      rest.slice(0, rest.length - 1),
      rest.slice(-1),
    ];

    const isLastRow = index === rawRowData.length - 1;

    return {
      ...obj,
      columns: [
        name,
        count,
        ...restWithoutLast.map((num, i) => (
          <span key={i}>
            {num} (<Percent value={num / count} />)
          </span>
        )),
        last,
      ].map(item => {
        if (isLastRow) {
          return <b>{item}</b>;
        }

        return item;
      }),
    };
  });
};

const MonitoringActivity = ({
  createdAtRange,
  data = [],
  staticData,
  staticDataIsLoading,
  getModalProps,
  getColumnOptions,
  getColumnsForAdminRow,
}) => {
  const hasCreatedAtRange = createdAtRange.startDate || createdAtRange.endDate;
  const { data: admins, loading: usersLoading } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });

  const isLoading = hasCreatedAtRange
    ? usersLoading && staticDataIsLoading
    : usersLoading;

  const rows = isLoading
    ? []
    : getRows({
        data,
        admins,
        staticData,
        hasCreatedAtRange,
        getColumnsForAdminRow,
      });

  return (
    <TableWithModal
      modalType="dialog"
      rows={rows}
      columnOptions={[
        ...sharedColumnOptions,
        ...getColumnOptions({ hasCreatedAtRange }),
      ]}
      initialOrderBy="count"
      getModalProps={getModalProps}
    />
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
