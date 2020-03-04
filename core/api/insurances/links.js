import Insurances from './insurances';
import {
  Borrowers,
  Revenues,
  Organisations,
  InsuranceRequests,
  InsuranceProducts,
} from '..';

import LinkInitializer from '../links/LinkInitializer';

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
  });
});
