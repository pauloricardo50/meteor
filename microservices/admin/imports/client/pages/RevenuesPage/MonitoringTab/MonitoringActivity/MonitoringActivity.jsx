//
import React from 'react';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';

import { Percent } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import {
  LOAN_STATUS_ORDER,
  LOANS_COLLECTION,
  ROLES,
  LOAN_STATUS,
} from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminUsers } from 'core/api/users/queries';
import { adminLoans } from 'core/api/loans/queries';
import TableWithModal from 'core/components/Table/TableWithModal';
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
  const loansToShow = hasCreatedAtRange
    ? loansByAdmin
    : uniqBy(adminData.loans, '_id');

  const loanCount = loansToShow.length;
  return {
    id: _id,
    loans: loansToShow,
    name,
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
        $body: { userCache: 1, status: 1, name: 1, createdAt: 1 },
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

      <TableWithModal
        modalType="dialog"
        rows={rows}
        columnOptions={getColumnOptions({ hasCreatedAtRange })}
        initialOrderBy={1}
        getModalProps={({ row: { loans: ls, name } }) => {
          const groups = groupBy(ls, 'status');
          return {
            title: name,
            children: (
              <div className="flex-col">
                {LOAN_STATUS_ORDER.map(status => {
                  const value = groups[status];

                  return (
                    <div key={status}>
                      <h2>
                        <StatusLabel
                          status={status}
                          collection={LOANS_COLLECTION}
                        />
                      </h2>
                      <div className="flex-col">
                        {value
                          ? value
                              .sort(
                                (
                                  { createdAt: createdAt1 },
                                  { createdAt: createdAt2 },
                                ) =>
                                  createdAt1.getTime() - createdAt2.getTime(),
                              )
                              .map(l => (
                                <CollectionIconLink
                                  key={l._id}
                                  relatedDoc={{
                                    ...l,
                                    collection: LOANS_COLLECTION,
                                  }}
                                />
                              ))
                          : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            ),
          };
        }}
      />
    </div>
  );
};

export default MonitoringActivityContainer(MonitoringActivity);
