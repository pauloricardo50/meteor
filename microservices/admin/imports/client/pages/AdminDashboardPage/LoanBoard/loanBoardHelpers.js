import _groupBy from 'lodash/groupBy';

import { LOAN_STATUS_ORDER } from 'core/api/constants';

export const ACTIONS = {
  ADD_FILTER: 'ADD_FILTER',
};

export const getInitialOptions = ({ currentUser }) => ({
  groupBy: 'status',
  assignedEmployeeId: { $in: [currentUser._id] },
});

export const filterReducer = (state, action) => {
  switch (action.type) {
  case ACTIONS.ADD_FILTER:
    return state;

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
    return LOAN_STATUS_ORDER.filter(status => !groups.includes(status));
  }

  default:
    return [];
  }
};

export const groupLoans = (loans, options) => {
  const { groupBy } = options;
  const groupedLoans = _groupBy(loans, groupBy);
  const groups = Object.keys(groupedLoans);

  const formattedColumns = [...groups, ...getMissingColumns(groupBy, groups)].map((group) => {
    const data = groupedLoans[group];
    return { id: group, data };
  });

  return formattedColumns.sort(makeSortColumns(options));
};
