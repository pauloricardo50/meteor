import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations/index';
import CommissionRates from './commissionRates';

LinkInitializer.directInit(() => {
  CommissionRates.addLinks({
    organisation: {
      field: 'organisationLink',
      collection: Organisations,
      type: 'one',
      metadata: true,
    },
  });
});
