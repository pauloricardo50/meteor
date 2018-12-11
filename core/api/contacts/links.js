import Contacts from '.';

import { Users, Organisations } from '..';

Contacts.addLinks({
  user: {
    collection: Users,
    field: 'userLink',
    type: 'one',
    metadata: true,
  },
  organisation: {
    collection: Organisations,
    inversedBy: 'contacts',
  },
});
