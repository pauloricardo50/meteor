export const LOAN_BOARD_ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
  SET_LOAN_ID: 'SET_LOAN_ID',
};

export const LOAN_BOARD_SORT_BY = {
  DUE_AT: 'item.nextDueTask.dueAt',
  CREATED_AT: 'createdAt',
  ASSIGNED_EMPLOYEE: 'user.assignedEmployeeCache.firstName',
  STATUS: 'status',
};

export const LOAN_BOARD_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const LOAN_BOARD_GROUP_BY = {
  STATUS: 'status',
  PROMOTION: 'promotions[0]._id',
  ADMIN: 'user.assignedEmployeeCache._id',
};
