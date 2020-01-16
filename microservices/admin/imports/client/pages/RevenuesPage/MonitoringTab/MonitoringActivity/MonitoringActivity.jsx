// @flow
import React from 'react';
import uniq from 'lodash/uniq';

import Table from 'core/components/Table';
import { Percent } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import {
  LOAN_STATUS_ORDER,
  LOANS_COLLECTION,
  ROLES,
  LOAN_STATUS,
} from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminUsers } from 'core/api/users/queries';
import { adminLoans } from 'core/api/loans/queries';
import MonitoringActivityFilters from './MonitoringActivityFilters';
import MonitoringActivityContainer from './MonitoringActivityContainer';

const statuses = LOAN_STATUS_ORDER.slice(1);

const getColumnOptions = ({ hasCreatedAtRange }) =>
  [
    { id: 'assignee', label: 'Conseiller' },
    { id: 'loanCount', label: 'Nb. de dossiers distincts' },
    hasCreatedAtRange && {
      id: 'lead',
      label: (
        <StatusLabel status={LOAN_STATUS.LEAD} collection={LOANS_COLLECTION} />
      ),
    },
    ...statuses.map(status => ({
      id: status,
      label: (
        <span>
          -> <StatusLabel status={status} collection={LOANS_COLLECTION} />
        </span>
      ),
    })),
  ].filter(x => x);

const getColumnsForAdminRow = ({ hasCreatedAtRange, loans, data }) => ({
  name,
  _id,
}) => {
  const loansByAdmin = loans.filter(
    ({ userCache }) =>
      userCache &&
      userCache.assignedEmployeeCache &&
      userCache.assignedEmployeeCache._id === _id,
  );
  const adminData = data.find(({ _id: dataId }) => dataId === _id) || {
    statusChanges: [],
  };
  const loanCount = hasCreatedAtRange
    ? loansByAdmin.length
    : uniq(adminData.loanIds).length;
  return {
    id: _id,
    columns: [
      name,
      loanCount,
      hasCreatedAtRange
        ? loansByAdmin.filter(({ status }) => status === LOAN_STATUS.LEAD)
            .length
        : null,
      ...statuses.map(status =>
        adminData.statusChanges
          .filter(({ nextStatus }) => nextStatus === status)
          .reduce((tot, { count }) => tot + count, 0),
      ),
    ].filter(x => x !== null),
  };
};

const getRows = ({ data, admins, loans, hasCreatedAtRange }) => {
  const byAdminData = admins.map(
    getColumnsForAdminRow({ data, loans, hasCreatedAtRange }),
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
    const [name, loanCount, ...rest] = columns;
    const [restWithoutLast, last] = [
      rest.slice(0, rest.length - 1),
      rest.slice(-1),
    ];

    const isLastRow = index === rawRowData.length - 1;

    return {
      ...obj,
      columns: [
        name,
        loanCount,
        ...restWithoutLast.map((num, i) => (
          <span key={i}>
            {num} (<Percent value={num / loanCount} />)
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
  activityRange,
  setActivityRange,
  createdAtRange,
  setCreatedAtRange,
  data = [],
}) => {
  const hasCreatedAtRange = createdAtRange.startDate || createdAtRange.endDate;
  const { data: admins, loading: usersLoading } = useStaticMeteorData({
    query: adminUsers,
    params: { roles: [ROLES.ADMIN], $body: { name: 1 } },
  });
  const { data: loans = [], loading: loansLoading } = useStaticMeteorData(
    {
      query: adminLoans,
      params: {
        createdAt: {
          $gte: createdAtRange.startDate,
          $lte: createdAtRange.endDate,
        },
        $body: { userCache: 1, status: 1 },
      },
    },
    [createdAtRange],
  );
  const isLoading = hasCreatedAtRange
    ? usersLoading && loansLoading
    : usersLoading;

  const rows = isLoading
    ? []
    : getRows({ data, admins, loans, hasCreatedAtRange });

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
        columnOptions={getColumnOptions({ hasCreatedAtRange })}
        initialOrderBy={1}
      />
    </div>
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
