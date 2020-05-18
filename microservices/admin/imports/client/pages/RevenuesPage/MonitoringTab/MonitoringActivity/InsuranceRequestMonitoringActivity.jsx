import React from 'react';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { withProps } from 'recompose';

import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';

const sortStatuses = (a, b) =>
  INSURANCE_REQUEST_STATUS_ORDER.indexOf(b) <
  INSURANCE_REQUEST_STATUS_ORDER.indexOf(a)
    ? 1
    : -1;

const tableStatuses = Object.values(INSURANCE_REQUEST_STATUS)
  .filter(
    status =>
      ![INSURANCE_REQUEST_STATUS.LEAD, INSURANCE_REQUEST_STATUS.TEST].includes(
        status,
      ),
  )
  .sort(sortStatuses);

const modalStatuses = Object.values(INSURANCE_REQUEST_STATUS)
  .filter(status => status !== INSURANCE_REQUEST_STATUS.TEST)
  .sort(sortStatuses);

const getColumnOptions = ({ hasCreatedAtRange }) =>
  [
    hasCreatedAtRange && {
      id: 'lead',
      label: (
        <StatusLabel
          status={INSURANCE_REQUEST_STATUS.LEAD}
          collection={INSURANCE_REQUESTS_COLLECTION}
        />
      ),
    },
    ...tableStatuses.map(status => ({
      id: status,
      label: (
        <span>
          ->{' '}
          <StatusLabel
            status={status}
            collection={INSURANCE_REQUESTS_COLLECTION}
          />
        </span>
      ),
    })),
  ].filter(x => x);

const getColumnsForAdminRow = ({
  hasCreatedAtRange,
  staticData: insuranceRequests,
  data,
}) => ({ firstName, _id }) => {
  const insuranceRequestsByAdmin = insuranceRequests.filter(
    ({ userCache }) =>
      userCache &&
      userCache.assignedEmployeeCache &&
      userCache.assignedEmployeeCache._id === _id,
  );
  const adminData = data.find(({ _id: dataId }) => dataId === _id) || {
    statusChanges: [],
  };
  const insuranceRequestsToShow = hasCreatedAtRange
    ? insuranceRequestsByAdmin
    : uniqBy(adminData.insuranceRequests, '_id');

  const count = insuranceRequestsToShow.length;
  return {
    id: _id,
    insuranceRequests: insuranceRequestsToShow,
    name: firstName,
    columns: [
      firstName,
      count,
      hasCreatedAtRange
        ? insuranceRequestsByAdmin.filter(
            ({ status }) => status === INSURANCE_REQUEST_STATUS.LEAD,
          ).length
        : null,
      ...tableStatuses.map(status =>
        adminData.statusChanges
          .filter(({ nextStatus }) => nextStatus === status)
          .reduce((tot, { count }) => tot + count, 0),
      ),
    ].filter(x => x !== null),
  };
};
const getModalProps = ({ row: { insuranceRequests: iRs, name } }) => {
  const groups = groupBy(iRs, 'status');
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
                  collection={INSURANCE_REQUESTS_COLLECTION}
                />
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
                      .map(iR => (
                        <CollectionIconLink key={iR._id} relatedDoc={iR} />
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

const InsuranceRequestMonitoringActivity = withProps(({ createdAtRange }) => {
  const { data: insuranceRequests = [], loading } = useStaticMeteorData(
    {
      query: INSURANCE_REQUESTS_COLLECTION,
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
    collection: INSURANCE_REQUESTS_COLLECTION,
    getColumnOptions,
    getColumnsForAdminRow,
    staticData: insuranceRequests,
    staticDataIsLoading: loading,
    getModalProps,
  };
});

export default InsuranceRequestMonitoringActivity(MonitoringActivity);
