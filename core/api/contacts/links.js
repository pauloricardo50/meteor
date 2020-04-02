import Lenders from '../lenders';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations';
import Tasks from '../tasks';
import Users from '../users';
import Contacts from '.';

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
