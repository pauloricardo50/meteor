import { Meteor } from 'meteor/meteor';

import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';
import get from 'lodash/get';

import { LOAN_STATUS_ORDER, LOAN_STATUS } from 'core/api/constants';
import { SORT_ORDER, GROUP_BY, ACTIONS, SORT_BY } from './loanBoardConstants';

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: GROUP_BY.STATUS,
  assignedEmployeeId: { $in: [currentUser._id] },
  sortBy: SORT_BY.DUE_AT,
  sortOrder: SORT_ORDER.ASC,
  step: undefined,
  category: undefined,
  status: undefined,
  promotionId: undefined,
  lenderId: undefined,
  loanId: '',
});

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
    return { ...state, sortBy: payload, sortOrder: SORT_ORDER.ASC };
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

  case ACTIONS.SET_LOAN_ID:
    return { ...state, loanId: payload };

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

export const makeSortColumns = ({ groupBy }, { promotions, admins }) => {
  switch (groupBy) {
  case GROUP_BY.STATUS: {
    const statuses = LOAN_STATUS_ORDER;
    return ({ id: statusA }, { id: statusB }) =>
      statuses.indexOf(statusA) - statuses.indexOf(statusB);
  }
  case GROUP_BY.PROMOTION: {
    return ({ id: idA }, { id: idB }) => {
      const promotionA = promotions.find(({ _id }) => idA === _id);
      const nameA = promotionA ? promotionA.name : '';
      const promotionB = promotions.find(({ _id }) => idB === _id);
      const nameB = promotionB ? promotionB.name : '';
      return nameA.localeCompare(nameB);
    };
  }
  case GROUP_BY.ADMIN: {
    return ({ id: idA }, { id: idB }) => {
      const nameA = idA !== 'undefined'
        ? admins.find(({ _id }) => idA === _id).firstName
        : '';
      const nameB = idB !== 'undefined'
        ? admins.find(({ _id }) => idB === _id).firstName
        : '';

      return nameA.localeCompare(nameB);
    };
  }

  default:
    return () => true;
  }
};

const getMissingColumns = (groupBy, groups) => {
  switch (groupBy) {
  case GROUP_BY.STATUS: {
    return LOAN_STATUS_ORDER.filter(status =>
      status !== LOAN_STATUS.UNSUCCESSFUL
          && status !== LOAN_STATUS.TEST
          && !groups.includes(status));
  }

  default:
    return [];
  }
};

const sortColumnData = (data, sortBy, sortOrder) => {
  const sorters = [
    (item) => {
      const value = get(item, sortBy);

      if (sortBy === SORT_BY.STATUS) {
        return LOAN_STATUS_ORDER.indexOf(value);
      }
      if (sortBy === SORT_BY.DUE_AT) {
        return item.nextDueTask && new Date(item.nextDueTask.dueAt);
      }

      return value;
    },
    item => get(item, 'userCache.lastName'),
  ];

  return _orderBy(data, sorters, [sortOrder]);
};
export const groupLoans = ({ loans, options, ...props }) => {
  const { groupBy, sortBy, sortOrder } = options;
  const groupedLoans = _groupBy(loans, groupBy);
  const groups = Object.keys(groupedLoans);

  const formattedColumns = [
    ...groups,
    ...getMissingColumns(groupBy, groups),
  ].map((group) => {
    const data = groupedLoans[group];
    const sortedData = sortColumnData(data, sortBy, sortOrder);
    return { id: group, data: sortedData };
  });

  return formattedColumns.sort(makeSortColumns(options, props));
};
