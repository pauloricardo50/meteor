import Partners from '.';

import { Users, Organisations } from '..';

Partners.addLinks({
  user: {
    collection: Users,
    field: 'userLink',
    type: 'one',
    metadata: true,
  },
  organisation: {
    collection: Organisations,
    inversedBy: 'partners',
  },
});
