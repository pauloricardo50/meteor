import { Borrowers, Users } from '../';

Borrowers.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
