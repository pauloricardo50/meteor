import UserService from './UserService';

UserService.migrateCache(
  { cacheField: 'assignedEmployeeCache' },
  // {
  //   $or: [
  //     { 'assignedEmployeeCache.lastName': { $exists: false } },
  //     { 'assignedEmployeeCache.firstName': { $exists: false } },
  //   ],
  // },
);
