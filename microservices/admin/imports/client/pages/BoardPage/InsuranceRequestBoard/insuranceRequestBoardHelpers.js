import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';
import get from 'lodash/get';

import {
  INSURANCE_REQUEST_STATUS_ORDER,
  INSURANCE_REQUEST_STATUS,
} from 'core/api/constants';
import { GROUP_BY, SORT_BY } from './insuranceRequestBoardConstants';

const insuranceRequestBoardStatusOrder = [
  INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
  INSURANCE_REQUEST_STATUS.PENDING,
  INSURANCE_REQUEST_STATUS.LEAD,
  INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
  INSURANCE_REQUEST_STATUS.ONGOING,
  INSURANCE_REQUEST_STATUS.CLOSING,
  INSURANCE_REQUEST_STATUS.BILLING,
  INSURANCE_REQUEST_STATUS.FINALIZED,
];

const getMissingColumns = (groupBy, groups) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      return INSURANCE_REQUEST_STATUS_ORDER.filter(
        status =>
          status !== INSURANCE_REQUEST_STATUS.UNSUCCESSFUL &&
          status !== INSURANCE_REQUEST_STATUS.TEST &&
          !groups.includes(status),
      );
    }

    default:
      return [];
  }
};

const makeSortColumnData = ({ sortBy, sortOrder, groupBy }) => {
  const sortOrders = [sortOrder];
  const sorters = [
    item => {
      const value = get(item, sortBy);

      if (sortBy === SORT_BY.STATUS) {
        return insuranceRequestBoardStatusOrder.indexOf(value);
      }

      return value;
    },
    item => get(item, 'user.lastName'),
  ];

  return data => _orderBy(data, sorters, sortOrders);
};

export const makeFormatColumn = ({
  groupedInsuranceRequests,
  sortBy,
  sortOrder,
  groupBy,
}) => {
  const formatData = data => data;
  const sortColumnData = makeSortColumnData({ sortBy, sortOrder, groupBy });

  return group => {
    const data = groupedInsuranceRequests[group];
    const sortedData = sortColumnData(data);
    const formattedData = formatData(sortedData);
    return { id: group, data: formattedData };
  };
};

export const makeSortColumns = ({ groupBy }, { admins }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS: {
      const statuses = INSURANCE_REQUEST_STATUS_ORDER;
      return ({ id: statusA }, { id: statusB }) =>
        statuses.indexOf(statusA) - statuses.indexOf(statusB);
    }
    case GROUP_BY.ADMIN: {
      return ({ id: idA }, { id: idB }) => {
        const adminA = admins.find(({ _id }) => idA === _id);
        const nameA = adminA ? adminA.firstName : '';
        const adminB = admins.find(({ _id }) => idB === _id);
        const nameB = adminB ? adminB.firstName : '';

        return nameA.localeCompare(nameB);
      };
    }

    default:
      return () => true;
  }
};

export const groupInsuranceRequests = ({
  insuranceRequests,
  options,
  ...props
}) => {
  const { groupBy, sortBy, sortOrder } = options;
  const groupedInsuranceRequests = _groupBy(insuranceRequests, groupBy);
  const groups = Object.keys(groupedInsuranceRequests);

  const formattedColumns = [
    ...groups,
    ...getMissingColumns(groupBy, groups),
  ].map(
    makeFormatColumn({ groupedInsuranceRequests, sortBy, sortOrder, groupBy }),
  );

  return formattedColumns.sort(makeSortColumns(options, props));
};
