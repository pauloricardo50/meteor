import React from 'react';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';

import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  INSURANCES_COLLECTION,
  INSURANCE_STATUS,
  INSURANCE_STATUS_ORDER,
} from 'core/api/insurances/insuranceConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
} from 'core/api/loans/loanConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { Percent } from 'core/components/Translation';

const getMainAssigneeId = (assigneeLinks = []) =>
  assigneeLinks.filter(({ isMain }) => isMain)[0]?._id;

const makeSortStatuses = order => (a, b) =>
  order.indexOf(b) < order.indexOf(a) ? 1 : -1;

export const COLLECTION_QUERIES = {
  [LOANS_COLLECTION]: createdAtRange => ({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        createdAt: {
          $gte: createdAtRange.startDate,
          $lte: createdAtRange.endDate,
        },
      },
      createdAt: 1,
      name: 1,
      status: 1,
      assigneeLinks: 1,
      $options: { sort: { createdAt: 1 } },
    },
  }),
  [INSURANCE_REQUESTS_COLLECTION]: createdAtRange => ({
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
      assigneeLinks: 1,
      $options: { sort: { createdAt: 1 } },
    },
  }),
  [INSURANCES_COLLECTION]: createdAtRange => ({
    query: INSURANCES_COLLECTION,
    params: {
      $filters: {
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
  }),
};

const COLLECTION_FIRST_STATUS = {
  [LOANS_COLLECTION]: LOAN_STATUS.LEAD,
  [INSURANCE_REQUESTS_COLLECTION]: INSURANCE_REQUEST_STATUS.LEAD,
  [INSURANCES_COLLECTION]: INSURANCE_STATUS.SUGGESTED,
};

const COLLECTION_TABLE_STATUSES = {
  [LOANS_COLLECTION]: Object.values(LOAN_STATUS)
    .filter(status => ![LOAN_STATUS.LEAD, LOAN_STATUS.TEST].includes(status))
    .sort(makeSortStatuses(LOAN_STATUS_ORDER)),
  [INSURANCE_REQUESTS_COLLECTION]: Object.values(INSURANCE_REQUEST_STATUS)
    .filter(
      status =>
        ![
          INSURANCE_REQUEST_STATUS.LEAD,
          INSURANCE_REQUEST_STATUS.TEST,
        ].includes(status),
    )
    .sort(makeSortStatuses(INSURANCE_REQUEST_STATUS_ORDER)),
  [INSURANCES_COLLECTION]: Object.values(INSURANCE_STATUS)
    .filter(status => status !== INSURANCE_STATUS.SUGGESTED)
    .sort(makeSortStatuses(INSURANCE_STATUS_ORDER)),
};

const COLLECTION_MODAL_STATUSES = {
  [LOANS_COLLECTION]: Object.values(LOAN_STATUS)
    .filter(status => status !== LOAN_STATUS.TEST)
    .sort(makeSortStatuses(LOAN_STATUS_ORDER)),
  [INSURANCE_REQUESTS_COLLECTION]: Object.values(INSURANCE_REQUEST_STATUS)
    .filter(status => status !== INSURANCE_REQUEST_STATUS.TEST)
    .sort(makeSortStatuses(INSURANCE_REQUEST_STATUS_ORDER)),
  [INSURANCES_COLLECTION]: INSURANCE_STATUS_ORDER,
};

const COLLECTION_FILTER_STATIC_DATA_BY_ADMIN = {
  [LOANS_COLLECTION]: _id => ({ assigneeLinks = [] }) =>
    getMainAssigneeId(assigneeLinks) === _id,
  [INSURANCE_REQUESTS_COLLECTION]: _id => ({ assigneeLinks = [] }) =>
    getMainAssigneeId(assigneeLinks) === _id,
  [INSURANCES_COLLECTION]: _id => ({ insuranceRequestCache = [] }) => {
    const [{ assigneeLinks = [] } = {}] = insuranceRequestCache;
    return getMainAssigneeId(assigneeLinks) === _id;
  },
};

const getColumnsForAdminRow = ({
  hasCreatedAtRange,
  staticData,
  data,
  collection,
}) => ({ firstName, _id }) => {
  const staticDataByAdmin = staticData.filter(
    COLLECTION_FILTER_STATIC_DATA_BY_ADMIN[collection](_id),
  );
  const adminData = data.find(({ _id: dataId }) => dataId === _id) || {
    statusChanges: [],
  };
  const dataToShow = hasCreatedAtRange
    ? staticDataByAdmin
    : uniqBy(adminData[collection], '_id');

  const count = dataToShow.length;

  return {
    id: _id,
    [collection]: dataToShow,
    name: firstName,
    columns: [
      firstName,
      count,
      hasCreatedAtRange
        ? staticDataByAdmin.filter(
            ({ status }) => status === COLLECTION_FIRST_STATUS[collection],
          ).length
        : null,
      ...COLLECTION_TABLE_STATUSES[collection].map(status =>
        adminData.statusChanges
          .filter(({ nextStatus }) => nextStatus === status)
          .reduce((tot, { count: c }) => tot + c, 0),
      ),
    ].filter(x => x !== null),
  };
};

export const getRows = ({
  data,
  admins,
  staticData,
  hasCreatedAtRange,
  filterStaticDataByAdmin,
  collection,
}) => {
  const byAdminData = admins.map(
    getColumnsForAdminRow({
      data,
      staticData,
      hasCreatedAtRange,
      filterStaticDataByAdmin,
      collection,
    }),
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

export const makeGetModalProps = ({ collection }) => ({ row }) => {
  const { name } = row;
  const data = row[collection];
  const groups = groupBy(data, 'status');
  return {
    title: name,
    children: (
      <div className="flex-col">
        {COLLECTION_MODAL_STATUSES[collection].map(status => {
          const value = groups[status];

          return (
            <div key={status}>
              <h2>
                <StatusLabel status={status} collection={collection} />
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
                      .map(doc => (
                        <CollectionIconLink key={doc._id} relatedDoc={doc} />
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

export const getColumnOptions = ({ hasCreatedAtRange, collection }) =>
  [
    hasCreatedAtRange && {
      id: COLLECTION_FIRST_STATUS[collection],
      label: (
        <StatusLabel
          status={COLLECTION_FIRST_STATUS[collection]}
          collection={collection}
        />
      ),
    },
    ...COLLECTION_TABLE_STATUSES[collection].map(status => ({
      id: status,
      label: (
        <span>
          -> <StatusLabel status={status} collection={collection} />
        </span>
      ),
    })),
  ].filter(x => x !== null);
