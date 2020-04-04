import Insurances from '../../insurances';
import Tasks from '../../tasks';
import Users from '../../users';
import InsuranceRequestService from './InsuranceRequestService';

InsuranceRequestService.cache(
  {
    cacheField: 'insurancesCache',
    fields: ['organisationLink'],
    collection: Insurances,
    type: 'many',
    referenceField: 'insuranceLinks:_id',
  },
  // {},
);

InsuranceRequestService.cache(
  {
    cacheField: 'userCache',
    type: 'one',
    collection: Users,
    fields: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      referredByOrganisationLink: 1,
      referredByUserLink: 1,
      assignedEmployeeCache: 1,
    },
    referenceField: 'userLink._id',
  },
  // {},
);

InsuranceRequestService.cache(
  {
    cacheField: 'tasksCache',
    type: 'inversed',
    collection: Tasks,
    fields: {
      createdAt: 1,
      dueAt: 1,
      status: 1,
      title: 1,
      isPrivate: 1,
      assigneeLink: 1,
    },
    referenceField: 'insuranceRequestLink._id',
  },
  // {},
);
