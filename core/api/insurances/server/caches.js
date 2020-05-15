import InsuranceRequests from '../../insuranceRequests';
import Tasks from '../../tasks';
import InsuranceService from './InsuranceService';

InsuranceService.cache(
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
    referenceField: 'insuranceLink._id',
  },
  // {},
);

InsuranceService.cache(
  {
    cacheField: 'insuranceRequestCache',
    type: 'many-inverse',
    collection: InsuranceRequests,
    fields: {
      assigneeLinks: 1,
      userCache: 1,
    },
    referenceField: 'insuranceLinks:_id',
  },
  {},
);
