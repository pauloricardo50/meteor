import React from 'react';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { compose, withProps } from 'recompose';

import {
  INSURANCES_COLLECTION,
  INSURANCE_STATUS,
  INSURANCE_STATUS_ORDER,
} from 'core/api/insurances/insuranceConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import MonitoringActivity from './MonitoringActivity';
import { MonitoringActivityFilterContainer } from './MonitoringActivityContainer';

const sortStatuses = (a, b) =>
  INSURANCE_STATUS_ORDER.indexOf(b) < INSURANCE_STATUS_ORDER.indexOf(a)
    ? 1
    : -1;

const tableStatuses = Object.values(INSURANCE_STATUS)
  .filter(status => status !== INSURANCE_STATUS.SUGGESTED)
  .sort(sortStatuses);

const modalStatuses = Object.values(INSURANCE_STATUS);

const getColumnOptions = ({ hasCreatedAtRange }) =>
  [
    hasCreatedAtRange && {
      id: 'suggested',
      label: (
        <StatusLabel
          status={INSURANCE_STATUS.SUGGESTED}
          collection={INSURANCES_COLLECTION}
        />
      ),
    },
    ...tableStatuses.map(status => ({
      id: status,
      label: (
        <span>
          -> <StatusLabel status={status} collection={INSURANCES_COLLECTION} />
        </span>
      ),
    })),
  ].filter(x => x);

const getColumnsForAdminRow = ({
  hasCreatedAtRange,
  staticData: insurances,
  data,
}) => ({ firstName, _id }) => {
  const insurancesByAdmin = insurances.filter(
    ({ insuranceRequestCache: { userCache } = {} }) =>
      userCache &&
      userCache.assignedEmployeeCache &&
      userCache.assignedEmployeeCache._id === _id,
  );
  const adminData = data.find(({ _id: dataId }) => dataId === _id) || {
    statusChanges: [],
  };
  const insurancesToShow = hasCreatedAtRange
    ? insurancesByAdmin
    : uniqBy(adminData.insurances, '_id');

  const count = insurancesToShow.length;
  return {
    id: _id,
    insurances: insurancesToShow,
    name: firstName,
    columns: [
      firstName,
      count,
      hasCreatedAtRange
        ? insurancesByAdmin.filter(
            ({ status }) => status === INSURANCE_STATUS.SUGGESTED,
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
const getModalProps = ({ row: { insurances: is, name } }) => {
  console.log('is:', is);
  const groups = groupBy(is, 'status');
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
                  collection={INSURANCES_COLLECTION}
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
                      .map(i => (
                        <CollectionIconLink key={i._id} relatedDoc={i} />
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

const InsuranceMonitoringActivity = withProps(({ createdAtRange }) => {
  const { data: insurances = [], loading } = useStaticMeteorData(
    {
      query: INSURANCES_COLLECTION,
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
        insuranceRequestCache: 1,
        insuranceRequest: { name: 1 },
        $options: { sort: { createdAt: 1 } },
      },
    },
    [createdAtRange],
  );
  return {
    collection: INSURANCES_COLLECTION,
    getColumnOptions,
    getColumnsForAdminRow,
    staticData: insurances,
    staticDataIsLoading: loading,
    getModalProps,
  };
});

export default compose(
  MonitoringActivityFilterContainer,
  InsuranceMonitoringActivity,
)(MonitoringActivity);
