import { Meteor } from 'meteor/meteor';

import get from 'lodash/get';
import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';

import {
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from 'core/api/insuranceRequests/insuranceRequestConstants';

import {
  ACTIONS,
  GROUP_BY,
  SORT_BY,
  SORT_ORDER,
} from './insuranceRequestBoardConstants';

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

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: GROUP_BY.STATUS,
  assignedEmployeeId: currentUser && { $in: [currentUser._id] },
  sortBy: SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  status: undefined,
  insuranceRequestId: '',
  additionalFields: [],
});

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

export const filterReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SET_FILTER: {
      const { name, value } = payload;
      return { ...state, [name]: value };
    }

    case ACTIONS.SET_COLUMN_SORT: {
      const { sortOrder } = state;
      if (state.sortBy === payload) {
        return {
          ...state,
          sortOrder:
            sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
        };
      }
      return {
        ...state,
        sortBy: payload,
        sortOrder: SORT_ORDER.ASC,
      };
    }

    case ACTIONS.SET_GROUP_BY: {
      const newStatus = { ...state, groupBy: payload };

      if (payload === GROUP_BY.STATUS) {
        return { ...newStatus, sortBy: SORT_BY.CREATED_AT };
      }
      return {
        ...newStatus,
        sortBy: SORT_BY.STATUS,
        sortOrder: SORT_ORDER.DESC,
      };
    }

    case ACTIONS.SET_INSURANCE_REQUEST_ID:
      return { ...state, insuranceRequestId: payload };

    case ACTIONS.RESET: {
      if (payload) {
        return payload;
      }
      return getInitialOptions({ currentUser: Meteor.user() });
    }

    default:
      throw new Error('Unknown action type');
  }
};
