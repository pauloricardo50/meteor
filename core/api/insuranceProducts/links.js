import Insurances from '../insurances/index';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations/index';
import InsuranceProducts from './insuranceProducts';

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
