import React from 'react';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';

import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
} from 'core/api/loans/loanConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';
import TableWithModal from 'core/components/Table/TableWithModal';
import { Percent } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivityContainer from './MonitoringActivityContainer';
import MonitoringActivityFilters from './MonitoringActivityFilters';

const sortStatuses = (a, b) =>
  LOAN_STATUS_ORDER.indexOf(b) < LOAN_STATUS_ORDER.indexOf(a) ? 1 : -1;

const tableStatuses = Object.values(LOAN_STATUS)
  .filter(status => ![LOAN_STATUS.LEAD, LOAN_STATUS.TEST].includes(status))
  .sort(sortStatuses);

const modalStatuses = Object.values(LOAN_STATUS)
  .filter(status => status !== LOAN_STATUS.TEST)
  .sort(sortStatuses);

const getColumnOptions = ({ hasCreatedAtRange }) =>
  [
    { id: 'assignee', label: 'Conseiller principal' },
    { id: 'loanCount', label: 'Nb. de dossiers distincts' },
    hasCreatedAtRange && {
      id: 'lead',
      label: (
        <StatusLabel status={LOAN_STATUS.LEAD} collection={LOANS_COLLECTION} />
      ),
    },
    ...tableStatuses.map(status => ({
      id: status,
      label: (
        <span>
          -> <StatusLabel status={status} collection={LOANS_COLLECTION} />
        </span>
      ),
    })),
  ].filter(x => x);

const getColumnsForAdminRow = ({ hasCreatedAtRange, loans, data }) => ({
  firstName,
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
    name: firstName,
    columns: [
      firstName,
      loanCount,
      hasCreatedAtRange
        ? loansByAdmin.filter(({ status }) => status === LOAN_STATUS.LEAD)
            .length
        : null,
      ...tableStatuses.map(status =>
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
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
  });
  const { data: loans = [], loading: loansLoading } = useStaticMeteorData(
    {
      query: LOANS_COLLECTION,
      params: {
        $filter: {
          createdAt: {
            $gte: createdAtRange.startDate,
            $lte: createdAtRange.endDate,
          },
        },
        createdAt: 1,
        name: 1,
        status: 1,
        userCache: 1,
        $options: { sort: { createdAt: 1 } },
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
        initialOrderBy="loanCount"
        getModalProps={({ row: { loans: ls, name } }) => {
          const groups = groupBy(ls, 'status');
          return {
            title: name,
            children: (
              <div className="flex-col">
                {modalStatuses.map(status => {
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
                                  relatedDoc={l}
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
