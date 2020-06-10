import Users from '../users';
import UserService from './UserService';

UserService.cache(
  {
    cacheField: 'assignedEmployeeCache',
    collection: Users,
    type: 'one',
    fields: { firstName: 1, lastName: 1 },
    referenceField: 'assignedEmployeeId',
  },
  // {
  //   $or: [
  //     { 'assignedEmployeeCache.lastName': { $exists: false } },
  //     { 'assignedEmployeeCache.firstName': { $exists: false } },
  //   ],
  // },
);
