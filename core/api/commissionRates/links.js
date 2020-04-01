import CommissionRates from './commissionRates';
import { Organisations } from '..';

import LinkInitializer from '../links/LinkInitializer';

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
