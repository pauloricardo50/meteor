export const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
  SET_INSURANCE_REQUEST_ID: 'SET_INSURANCE_REQUEST_ID',
};

export const SORT_BY = {
  CREATED_AT: 'createdAt',
  ASSIGNED_EMPLOYEE: 'user.assignedEmployeeCache.firstName',
  STATUS: 'status',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const GROUP_BY = {
  STATUS: 'status',
  ADMIN: 'mainAssigneeLink._id',
};
