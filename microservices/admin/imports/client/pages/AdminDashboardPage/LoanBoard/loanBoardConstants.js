export const ACTIONS = {
  SET_FILTER: 'SET_FILTER',
  SET_COLUMN_SORT: 'SET_COLUMN_SORT',
  SET_GROUP_BY: 'SET_GROUP_BY',
  RESET: 'RESET',
};

export const SORT_BY = {
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
