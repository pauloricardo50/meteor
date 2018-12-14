import Contacts from '.';

import { Users, Organisations } from '..';
import Offers from '../offers';

Contacts.addLinks({
  user: {
    collection: Users,
    field: 'userLink',
    type: 'one',
    metadata: true,
  },
  organisations: {
    collection: Organisations,
    inversedBy: 'contacts',
  },
  offers: {
    collection: Offers,
    inversedBy: 'contact',
  },
});
