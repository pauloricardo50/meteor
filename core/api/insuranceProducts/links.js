import Insurances from '../insurances';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations';
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
