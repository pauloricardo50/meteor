import React from 'react';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { compose, withProps } from 'recompose';

import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
} from 'core/api/loans/loanConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';
import { MonitoringActivityFilterContainer } from './MonitoringActivityContainer';

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

const getColumnsForAdminRow = ({
  hasCreatedAtRange,
  staticData: loans,
  data,
}) => ({ firstName, _id }) => {
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
const getModalProps = ({ row: { loans: ls, name } }) => {
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
                <StatusLabel status={status} collection={LOANS_COLLECTION} />
              </h2>
              <div className="flex-col">
                {value
                  ? value
                      .sort(
                        (
                          { createdAt: createdAt1 },
                          { createdAt: createdAt2 },
                        ) => createdAt1.getTime() - createdAt2.getTime(),
                      )
                      .map(l => (
                        <CollectionIconLink key={l._id} relatedDoc={l} />
                      ))
                  : '-'}
              </div>
            </div>
          );
        })}
      </div>
    ),
  };
};

const LoanMonitoringActivity = withProps(({ createdAtRange }) => {
  const { data: loans = [], loading } = useStaticMeteorData(
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
  return {
    collection: LOANS_COLLECTION,
    getColumnOptions,
    getColumnsForAdminRow,
    staticData: loans,
    staticDataIsLoading: loading,
    getModalProps,
  };
});

export default compose(
  MonitoringActivityFilterContainer,
  LoanMonitoringActivity,
)(MonitoringActivity);
