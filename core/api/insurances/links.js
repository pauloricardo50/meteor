import Insurances from './insurances';
import { Borrowers, Revenues, Tasks, Users, Activities } from '..';

import LinkInitializer from '../links/LinkInitializer';

const userCache = {
  _id: 1,
  firstName: 1,
  lastName: 1,
  referredByOrganisationLink: 1,
  referredByUserLink: 1,
  assignedEmployeeCache: 1,
};

const tasksCache = {
  createdAt: 1,
  dueAt: 1,
  status: 1,
  title: 1,
  isPrivate: 1,
  assigneeLink: 1,
};

LinkInitializer.directInit(() => {
  Insurances.addLinks({
    borrowers: {
      field: 'borrowerLinks',
      collection: Borrowers,
      type: 'many',
      metadata: true,
    },
    user: {
      field: 'userLink',
      collection: Users,
      type: 'one',
      denormalize: {
        field: 'userCache',
        body: userCache,
      },
    },
    assignees: {
      field: 'assigneeLinks',
      collection: Users,
      type: 'many',
      metadata: true,
    },
    revenues: {
      field: 'revenueLinks',
      collection: Revenues,
      type: 'many',
      metadata: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  Insurances.addLinks({
    activities: {
      inversedBy: 'insurance',
      collection: Activities,
      autoremove: true,
    },
    tasks: {
      inversedBy: 'insurance',
      collection: Tasks,
      autoremove: true,
      denormalize: {
        field: 'tasksCache',
        body: tasksCache,
      },
    },
  });
});
