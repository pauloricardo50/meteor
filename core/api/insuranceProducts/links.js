import InsuranceProducts from './insuranceProducts';
import { Organisations, Insurances } from '..';

import LinkInitializer from '../links/LinkInitializer';

LinkInitializer.directInit(() => {
  InsuranceProducts.addLinks({
    organisation: {
      field: 'organisationLink',
      collection: Organisations,
      type: 'one',
      metadata: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  InsuranceProducts.addLinks({
    insurances: {
      inversedBy: 'insuranceProduct',
      collection: Insurances,
    },
  });
});
