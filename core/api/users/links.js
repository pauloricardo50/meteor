import { Users, Loans, Offers, Borrowers, Properties } from '../';

Users.addLinks({
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
  borrowers: {
    collection: Borrowers,
    inversedBy: 'user',
  },
  properties: {
    collection: Properties,
    inversedBy: 'user',
  },
  offers: {
    collection: Offers,
    inversedBy: 'user',
  },
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
});
