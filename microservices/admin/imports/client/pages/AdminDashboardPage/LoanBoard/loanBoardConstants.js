export const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
  SET_LOAN_ID: 'SET_LOAN_ID',
};

export const SORT_BY = {
  DUE_AT: 'item.nextDueDate.dueAt',
  CREATED_AT: 'createdAt',
  ASSIGNED_EMPLOYEE: 'userCache.assignedEmployeeCache.firstName',
  STATUS: 'status',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const GROUP_BY = {
  STATUS: 'status',
  PROMOTION: 'promotions[0]._id',
  ADMIN: 'userCache.assignedEmployeeCache._id',
};
