import InsuranceRequests from './insuranceRequests';
import {
  Borrowers,
  Revenues,
  Tasks,
  Users,
  Activities,
  Insurances,
  Loans,
} from '..';

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

const loanCache = {
  name: 1,
  user: { name: 1 },
  assigneeLinks: { _id: 1 },
};

LinkInitializer.directInit(() => {
  InsuranceRequests.addLinks({
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
      metadata: true,
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
      unique: true,
    },
    insurances: {
      field: 'insuranceLinks',
      collection: Insurances,
      type: 'many',
      metadata: true,
      unique: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  InsuranceRequests.addLinks({
    activities: {
      inversedBy: 'insuranceRequest',
      collection: Activities,
      autoremove: true,
    },
    tasks: {
      inversedBy: 'insuranceRequest',
      collection: Tasks,
      autoremove: true,
      denormalize: {
        field: 'tasksCache',
        body: tasksCache,
      },
    },
    loan: {
      inversedBy: 'insuranceRequests',
      collection: Loans,
    },
  });
});
