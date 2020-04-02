import Activities from '../activities/index';
import Borrowers from '../borrowers/index';
import InsuranceProducts from '../insuranceProducts/index';
import InsuranceRequests from '../insuranceRequests/index';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations/index';
import Revenues from '../revenues/index';
import Tasks from '../tasks/tasks';
import Insurances from './insurances';

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
    borrower: {
      field: 'borrowerLink',
      collection: Borrowers,
      type: 'one',
      metadata: true,
    },
    organisation: {
      field: 'organisationLink',
      collection: Organisations,
      type: 'one',
      metadata: true,
    },
    revenues: {
      field: 'revenueLinks',
      collection: Revenues,
      type: 'many',
      metadata: true,
      unique: true,
    },
    insuranceProduct: {
      field: 'insuranceProductLink',
      collection: InsuranceProducts,
      type: 'one',
      metadata: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  Insurances.addLinks({
    insuranceRequest: {
      inversedBy: 'insurances',
      collection: InsuranceRequests,
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
    activities: {
      inversedBy: 'insurance',
      collection: Activities,
      autoremove: true,
    },
  });
});
