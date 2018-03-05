import { Borrowers, Users } from '../';

Borrowers.addLinks({
  borrowerAsignee: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
