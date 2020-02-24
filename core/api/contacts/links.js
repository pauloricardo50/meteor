import Contacts from '.';

import { Users, Organisations, Lenders, Offers, Tasks } from '..';
import LinkInitializer from '../links/LinkInitializer';

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

LinkInitializer.inversedInit(() => {
  Contacts.addLinks({
    tasks: {
      collection: Tasks,
      inversedBy: 'contact',
      autoremove: true,
    },
  });
});
