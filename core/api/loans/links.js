import { Loans, Properties, Borrowers, Users, Tasks } from '../';

Loans.addLinks({
  property: {
    field: 'propertyId',
    collection: Properties,
    type: 'one',
  },
  borrowers: {
    field: 'borrowerIds',
    collection: Borrowers,
    type: 'many',
  },
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  tasks: {
    collection: Tasks,
    inversedBy: 'loan',
  },
});
