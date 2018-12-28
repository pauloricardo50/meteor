import Contacts from '.';

import { Users, Organisations, Lenders, Offers } from '..';

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
  lenders: {
    collection: Lenders,
    inversedBy: 'contact',
  },
});
