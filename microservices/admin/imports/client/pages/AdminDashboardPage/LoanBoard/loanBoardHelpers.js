import _groupBy from 'lodash/groupBy';
import _orderBy from 'lodash/orderBy';
import get from 'lodash/get';

import { LOAN_STATUS_ORDER, LOAN_STATUS, STEP_ORDER } from 'core/api/constants';

export const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: 'status',
  assignedEmployeeId: { $in: [currentUser._id] },
  sortBy: 'createdAt',
  sortOrder: SORT_ORDER.ASC,
  step: { $in: STEP_ORDER },
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

  default:
    throw new Error('Unknown action type');
  }
};

export const makeSortColumns = ({ groupBy }) => {
  switch (groupBy) {
  case 'status': {
    const statuses = LOAN_STATUS_ORDER;
    return ({ id: statusA }, { id: statusB }) =>
      statuses.indexOf(statusA) - statuses.indexOf(statusB);
  }

  default:
    return () => true;
  }
};

const getMissingColumns = (groupBy, groups) => {
  switch (groupBy) {
  case 'status': {
    return LOAN_STATUS_ORDER.filter(status =>
      status !== LOAN_STATUS.UNSUCCESSFUL
          && status !== LOAN_STATUS.TEST
          && !groups.includes(status));
  }

  default:
    return [];
  }
};

const sortColumnData = (data, sortBy, sortOrder) =>
  _orderBy(data, [item => get(item, sortBy)], [sortOrder]);

export const groupLoans = (loans, options) => {
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

  return formattedColumns.sort(makeSortColumns(options));
};
