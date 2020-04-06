import Activities from '../activities';
import Borrowers from '../borrowers';
import InsuranceProducts from '../insuranceProducts';
import InsuranceRequests from '../insuranceRequests';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations';
import Revenues from '../revenues';
import Tasks from '../tasks/tasks';
import Insurances from './insurances';

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
    },
    activities: {
      inversedBy: 'insurance',
      collection: Activities,
      autoremove: true,
    },
  });
});
