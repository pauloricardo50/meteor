export const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
  SET_DOC_ID: 'SET_DOC_ID',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const SORT_BY = {
  CREATED_AT: 'createdAt',
  ASSIGNED_EMPLOYEE: 'user.assignedEmployeeCache.firstName',
  STATUS: 'status',
};

export const GROUP_BY = {
  STATUS: 'status',
  ADMIN: 'mainAssigneeLink._id',
};
